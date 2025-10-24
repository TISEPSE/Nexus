use serde::{Deserialize, Serialize};
use std::sync::Mutex;
use tauri::State;

// Google Drive OAuth credentials
// IMPORTANT: Set these as environment variables for security:
// - GOOGLE_CLIENT_ID
// - GOOGLE_CLIENT_SECRET
// For development, you can create a .env file at the project root
const CLIENT_ID: &str = option_env!("GOOGLE_CLIENT_ID")
    .unwrap_or("YOUR_CLIENT_ID_HERE");
const CLIENT_SECRET: &str = option_env!("GOOGLE_CLIENT_SECRET")
    .unwrap_or("YOUR_CLIENT_SECRET_HERE");
const REDIRECT_URI: &str = "http://localhost:3000/oauth/callback";

// OAuth state management
pub struct OAuthState {
    access_token: Mutex<Option<String>>,
}

impl OAuthState {
    pub fn new() -> Self {
        Self {
            access_token: Mutex::new(None),
        }
    }

    pub fn set_token(&self, token: String) {
        let mut access_token = self.access_token.lock().unwrap();
        *access_token = Some(token);
    }

    pub fn get_token(&self) -> Option<String> {
        let access_token = self.access_token.lock().unwrap();
        access_token.clone()
    }

    pub fn clear_token(&self) {
        let mut access_token = self.access_token.lock().unwrap();
        *access_token = None;
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct AuthResponse {
    pub success: bool,
    pub message: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct DriveFile {
    pub id: String,
    pub name: String,
    #[serde(rename = "mimeType")]
    pub mime_type: String,
    #[serde(rename = "modifiedTime")]
    pub modified_time: String,
    pub size: Option<String>,
    #[serde(rename = "webViewLink")]
    pub web_view_link: Option<String>,
}

#[derive(Debug, Deserialize)]
struct DriveFilesResponse {
    files: Vec<DriveFile>,
}

/// Initiate Google OAuth authentication flow
///
/// This opens a browser window for the user to authenticate with Google
/// Returns authentication URL and state for security
#[tauri::command]
pub async fn google_drive_authenticate(
    oauth_state: State<'_, OAuthState>,
) -> Result<AuthResponse, String> {
    use oauth2::{
        AuthUrl, AuthorizationCode, ClientId, ClientSecret, CsrfToken, PkceCodeChallenge,
        RedirectUrl, Scope, TokenUrl, TokenResponse, basic::BasicClient,
    };
    use std::io::{BufRead, BufReader, Write};
    use std::net::TcpListener;

    // Check if CLIENT_ID and CLIENT_SECRET are configured
    if CLIENT_ID.starts_with("YOUR_") || CLIENT_SECRET.starts_with("YOUR_") {
        return Ok(AuthResponse {
            success: false,
            message: Some(
                "Google Drive OAuth is not configured. Please set up CLIENT_ID and CLIENT_SECRET in src-tauri/src/google_drive.rs or use environment variables.".to_string()
            ),
        });
    }

    let client = BasicClient::new(
        ClientId::new(CLIENT_ID.to_string()),
        Some(ClientSecret::new(CLIENT_SECRET.to_string())),
        AuthUrl::new("https://accounts.google.com/o/oauth2/v2/auth".to_string())
            .map_err(|e| format!("Invalid auth URL: {}", e))?,
        Some(
            TokenUrl::new("https://oauth2.googleapis.com/token".to_string())
                .map_err(|e| format!("Invalid token URL: {}", e))?,
        ),
    )
    .set_redirect_uri(
        RedirectUrl::new(REDIRECT_URI.to_string())
            .map_err(|e| format!("Invalid redirect URL: {}", e))?,
    );

    // Generate PKCE challenge for additional security
    let (pkce_challenge, pkce_verifier) = PkceCodeChallenge::new_random_sha256();

    // Generate authorization URL
    let (auth_url, csrf_token) = client
        .authorize_url(CsrfToken::new_random)
        .add_scope(Scope::new("https://www.googleapis.com/auth/drive.readonly".to_string()))
        .set_pkce_challenge(pkce_challenge)
        .url();

    // Open browser for authentication
    if let Err(e) = open::that(auth_url.as_str()) {
        return Err(format!("Failed to open browser: {}", e));
    }

    // Start local HTTP server to receive OAuth callback
    let listener = TcpListener::bind("127.0.0.1:3000")
        .map_err(|e| format!("Failed to start callback server: {}", e))?;

    // Wait for callback (with timeout handled by connection)
    let (mut stream, _) = listener
        .accept()
        .map_err(|e| format!("Failed to accept connection: {}", e))?;

    let mut reader = BufReader::new(&stream);
    let mut request_line = String::new();
    reader
        .read_line(&mut request_line)
        .map_err(|e| format!("Failed to read request: {}", e))?;

    // Extract authorization code from request
    let redirect_url = request_line
        .split_whitespace()
        .nth(1)
        .ok_or("Invalid request")?;

    let url = format!("http://localhost:3000{}", redirect_url);
    let parsed_url = url::Url::parse(&url)
        .map_err(|e| format!("Failed to parse URL: {}", e))?;

    let code_pair = parsed_url
        .query_pairs()
        .find(|(key, _)| key == "code")
        .ok_or("No authorization code in callback")?;

    let received_state = parsed_url
        .query_pairs()
        .find(|(key, _)| key == "state")
        .map(|(_, value)| value.into_owned());

    // Verify CSRF token
    if received_state.as_deref() != Some(csrf_token.secret()) {
        let response = "HTTP/1.1 400 Bad Request\r\n\r\n<html><body><h1>Authentication failed: Invalid state</h1></body></html>";
        let _ = stream.write_all(response.as_bytes());
        return Err("CSRF token mismatch".to_string());
    }

    let code = AuthorizationCode::new(code_pair.1.into_owned());

    // Send success response to browser
    let response = "HTTP/1.1 200 OK\r\n\r\n<html><body><h1>Authentication successful!</h1><p>You can close this window and return to Nexus.</p><script>window.close();</script></body></html>";
    let _ = stream.write_all(response.as_bytes());

    // Exchange authorization code for access token
    let token_result = client
        .exchange_code(code)
        .set_pkce_verifier(pkce_verifier)
        .request_async(oauth2::reqwest::async_http_client)
        .await
        .map_err(|e| format!("Failed to exchange code for token: {}", e))?;

    // Store the access token
    let access_token = token_result.access_token().secret().to_string();
    oauth_state.set_token(access_token);

    Ok(AuthResponse {
        success: true,
        message: Some("Authentication successful!".to_string()),
    })
}

/// List files from Google Drive
///
/// Requires authentication first
/// Returns list of files with metadata
#[tauri::command]
pub async fn google_drive_list_files(
    oauth_state: State<'_, OAuthState>,
) -> Result<Vec<DriveFile>, String> {
    let token = oauth_state
        .get_token()
        .ok_or_else(|| "Not authenticated. Please authenticate first.".to_string())?;

    // Check if using demo token
    if token == "DEMO_TOKEN_REPLACE_WITH_REAL_OAUTH" {
        // Return demo data for testing
        return Ok(vec![
            DriveFile {
                id: "demo-1".to_string(),
                name: "Project Presentation.pptx".to_string(),
                mime_type: "application/vnd.google-apps.presentation".to_string(),
                modified_time: chrono::Utc::now().to_rfc3339(),
                size: Some("2457600".to_string()), // 2.4 MB
                web_view_link: Some("https://docs.google.com/presentation/d/demo-1".to_string()),
            },
            DriveFile {
                id: "demo-2".to_string(),
                name: "Budget 2024.xlsx".to_string(),
                mime_type: "application/vnd.google-apps.spreadsheet".to_string(),
                modified_time: chrono::Utc::now().to_rfc3339(),
                size: Some("1048576".to_string()), // 1 MB
                web_view_link: Some("https://docs.google.com/spreadsheets/d/demo-2".to_string()),
            },
            DriveFile {
                id: "demo-3".to_string(),
                name: "Meeting Notes.docx".to_string(),
                mime_type: "application/vnd.google-apps.document".to_string(),
                modified_time: chrono::Utc::now().to_rfc3339(),
                size: Some("524288".to_string()), // 512 KB
                web_view_link: Some("https://docs.google.com/document/d/demo-3".to_string()),
            },
            DriveFile {
                id: "demo-4".to_string(),
                name: "Photos".to_string(),
                mime_type: "application/vnd.google-apps.folder".to_string(),
                modified_time: chrono::Utc::now().to_rfc3339(),
                size: None,
                web_view_link: Some("https://drive.google.com/drive/folders/demo-4".to_string()),
            },
        ]);
    }

    // Real API call to Google Drive
    let client = reqwest::Client::new();
    let response = client
        .get("https://www.googleapis.com/drive/v3/files")
        .query(&[
            ("pageSize", "20"),
            ("fields", "files(id,name,mimeType,modifiedTime,size,webViewLink)"),
        ])
        .bearer_auth(&token)
        .send()
        .await
        .map_err(|e| format!("Failed to fetch files: {}", e))?;

    if !response.status().is_success() {
        return Err(format!(
            "Google Drive API error: {}",
            response.status()
        ));
    }

    let files_response: DriveFilesResponse = response
        .json()
        .await
        .map_err(|e| format!("Failed to parse response: {}", e))?;

    Ok(files_response.files)
}

/// Logout from Google Drive
///
/// Clears stored authentication token
#[tauri::command]
pub async fn google_drive_logout(
    oauth_state: State<'_, OAuthState>,
) -> Result<AuthResponse, String> {
    oauth_state.clear_token();

    Ok(AuthResponse {
        success: true,
        message: Some("Logged out successfully".to_string()),
    })
}
