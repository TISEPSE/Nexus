export interface AITool {
  id: string;
  name: string;
  description: string;
  url: string;
  category: string[];
  logo: string | string[]; // Single URL or array of fallback URLs
  tags: string[];
  domain?: string; // Optional: explicit domain for favicon APIs (auto-extracted if not provided)
  executables?: { // Optional: native app executables for each platform
    windows?: string[];
    macos?: string[];
    linux?: string[];
  };
}

export const aiTools: AITool[] = [
  // Chat & Assistant
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    description: 'Conversational AI assistant by OpenAI',
    url: 'https://chat.openai.com',
    category: ['AI', 'Chat', 'Développement', 'Writing'],
    logo: [
      'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
      'https://openai.com/favicon.ico',
    ],
    domain: 'openai.com',
    tags: ['chat', 'gpt', 'assistant', 'openai']
  },
  {
    id: 'claude',
    name: 'Claude',
    description: 'Advanced AI assistant by Anthropic',
    url: 'https://claude.ai',
    category: ['AI', 'Chat', 'Développement', 'Writing'],
    logo: [
      'https://claude.ai/images/claude_app_icon.png',
      'https://www.anthropic.com/images/icons/safari-pinned-tab.svg',
    ],
    domain: 'claude.ai',
    tags: ['chat', 'claude', 'assistant', 'anthropic']
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    description: 'Google\'s multimodal AI assistant',
    url: 'https://gemini.google.com',
    category: ['AI', 'Chat', 'Développement', 'Research'],
    logo: [
      'https://www.gstatic.com/lamda/images/gemini_sparkle_v002_d4735304ff6292a690345.svg',
      'https://www.gstatic.com/lamda/images/gemini_favicon_f069958c85030456e93de685481c559f160ea06b.png',
    ],
    domain: 'gemini.google.com',
    tags: ['chat', 'google', 'gemini', 'multimodal']
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    description: 'AI-powered search with sources',
    url: 'https://perplexity.ai',
    category: ['AI', 'Research', 'Search'],
    logo: [
      'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/perplexity-ai-icon.png',
      'https://www.perplexity.ai/favicon.svg',
    ],
    domain: 'perplexity.ai',
    tags: ['search', 'research', 'citations'],
    executables: {
      linux: ['perplexity', '/snap/bin/perplexity'],
    }
  },
  {
    id: 'poe',
    name: 'Poe',
    description: 'Access multiple AI models',
    url: 'https://poe.com',
    category: ['AI', 'Chat', 'Multi-tool'],
    logo: [
      'https://psc2.cf2.poecdn.net/favicon.svg',
      'https://poe.com/favicon.ico',
    ],
    domain: 'poe.com',
    tags: ['multi-model', 'chat', 'platform']
  },

  // Code Assistants
  {
    id: 'vscode',
    name: 'Visual Studio Code',
    description: 'Free code editor by Microsoft',
    url: 'https://code.visualstudio.com',
    category: ['Développement', 'IDE', 'Productivity'],
    logo: [
      'https://code.visualstudio.com/assets/images/code-stable.png',
      'https://code.visualstudio.com/favicon.ico',
    ],
    domain: 'code.visualstudio.com',
    tags: ['code', 'editor', 'ide', 'microsoft', 'free', 'open-source'],
    executables: {
      windows: ['Code', 'Code - Insiders'],
      macos: ['com.microsoft.VSCode', 'Visual Studio Code'],
      linux: ['code', 'code-insiders'],
    }
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    description: 'AI pair programmer',
    url: 'https://github.com/features/copilot',
    category: ['AI', 'Développement'],
    logo: [
      'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
      'https://github.com/favicon.ico',
    ],
    domain: 'github.com',
    tags: ['code', 'completion', 'github', 'vscode']
  },
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor',
    url: 'https://cursor.sh',
    category: ['AI', 'Développement', 'IDE'],
    logo: [
      'https://cursor.sh/brand/icon.svg',
      'https://cursor.sh/favicon.ico',
    ],
    domain: 'cursor.sh',
    tags: ['code', 'editor', 'ide', 'ai'],
    executables: {
      windows: ['Cursor'],
      macos: ['com.todesktop.230313mzl4w4u92', 'Cursor'],
      linux: ['cursor', 'cursor-appimage'],
    }
  },
  {
    id: 'codeium',
    name: 'Codeium',
    description: 'Free AI code completion',
    url: 'https://codeium.com',
    category: ['AI', 'Développement'],
    logo: 'https://codeium.com/favicon.ico',
    domain: 'codeium.com',
    tags: ['code', 'completion', 'free', 'ide']
  },
  {
    id: 'tabnine',
    name: 'Tabnine',
    description: 'AI code assistant',
    url: 'https://www.tabnine.com',
    category: ['AI', 'Développement'],
    logo: 'https://www.tabnine.com/favicon.ico',
    domain: 'tabnine.com',
    tags: ['code', 'completion', 'privacy']
  },
  {
    id: 'replit-ai',
    name: 'Replit AI',
    description: 'Browser-based AI IDE',
    url: 'https://replit.com',
    category: ['AI', 'Développement', 'IDE'],
    logo: [
      'https://replit.com/public/images/favicon.ico',
      'https://replit.com/favicon.ico',
    ],
    domain: 'replit.com',
    tags: ['code', 'browser', 'ide', 'collaborative']
  },

  // Image Generation
  {
    id: 'midjourney',
    name: 'Midjourney',
    description: 'AI art generation',
    url: 'https://www.midjourney.com/app',
    category: ['AI', 'Image', 'Art'],
    logo: [
      'https://seeklogo.com/images/M/midjourney-logo-BF3F3F0A92-seeklogo.com.png',
      'https://cdn.jsdelivr.net/gh/walkxcode/dashboard-icons/png/midjourney-light.png',
      'https://www.midjourney.com/favicon.ico',
    ],
    domain: 'midjourney.com',
    tags: ['image', 'art', 'generation', 'creative']
  },
  {
    id: 'dalle',
    name: 'DALL-E 3',
    description: 'OpenAI image generator',
    url: 'https://chat.openai.com',
    category: ['AI', 'Image', 'Art'],
    logo: [
      'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
      'https://openai.com/favicon.ico',
    ],
    domain: 'openai.com',
    tags: ['image', 'generation', 'openai', 'art']
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion',
    description: 'Open-source AI imaging',
    url: 'https://clipdrop.co/stable-diffusion',
    category: ['AI', 'Image', 'Art'],
    logo: 'https://stability.ai/favicon.ico',
    domain: 'stability.ai',
    tags: ['image', 'open-source', 'generation']
  },
  {
    id: 'leonardo',
    name: 'Leonardo.AI',
    description: 'AI art for creatives',
    url: 'https://app.leonardo.ai',
    category: ['AI', 'Image', 'Art'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.MTrz8aUbYcNtrT61W4tO8wAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=a2e47bd013966c4680325aaa50bddc9a660e44eb9a8788153f7d22c810f56743&ipo=images',
      'https://leonardo.ai/favicon.ico',
    ],
    domain: 'leonardo.ai',
    tags: ['image', 'art', 'creative', 'generation']
  },
  {
    id: 'playground',
    name: 'Playground AI',
    description: 'Free AI image editor',
    url: 'https://playground.com',
    category: ['AI', 'Image', 'Art'],
    logo: new URL('../assets/idtWA4dwEy_logos.png', import.meta.url).href,
    domain: 'playgroundai.com',
    tags: ['image', 'free', 'editing', 'art']
  },

  // Writing & Content
  {
    id: 'jasper',
    name: 'Jasper',
    description: 'AI content creation',
    url: 'https://www.jasper.ai/',
    category: ['AI', 'Writing', 'Marketing'],
    logo: 'https://www.jasper.ai/favicon.ico',
    domain: 'jasper.ai',
    tags: ['writing', 'marketing', 'content']
  },
  {
    id: 'grammarly',
    name: 'Grammarly',
    description: 'AI writing assistant',
    url: 'https://app.grammarly.com',
    category: ['AI', 'Writing'],
    logo: [
      'https://static.grammarly.com/assets/files/efe8ab17bcc04c724c4df49741e4e1e0/favicon.svg',
      'https://www.grammarly.com/favicon.ico',
    ],
    domain: 'grammarly.com',
    tags: ['writing', 'grammar', 'editing']
  },
  {
    id: 'copy-ai',
    name: 'Copy.ai',
    description: 'AI copywriting tool',
    url: 'https://app.copy.ai',
    category: ['AI', 'Writing', 'Marketing'],
    logo: 'https://www.copy.ai/favicon.ico',
    domain: 'copy.ai',
    tags: ['copywriting', 'marketing', 'sales']
  },

  // Computer Vision AI
  {
    id: 'roboflow',
    name: 'Roboflow',
    description: 'Computer vision platform for training models',
    url: 'https://roboflow.com',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://roboflow.com/favicon.ico',
    ],
    domain: 'roboflow.com',
    tags: ['computer-vision', 'object-detection', 'training', 'dataset']
  },
  {
    id: 'yolo',
    name: 'Ultralytics YOLO',
    description: 'Real-time object detection',
    url: 'https://ultralytics.com',
    category: ['AI', 'Vision', 'Développement'],
    logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.GdZPe9LcIDms1BkB9q_j3QHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=21706640b90175c6a73b4c492d112ccbe79824742ea1f3fb96161fe08b5ae2a3&ipo=images',
    domain: 'ultralytics.com',
    tags: ['computer-vision', 'object-detection', 'yolo', 'real-time']
  },
  {
    id: 'clarifai',
    name: 'Clarifai',
    description: 'AI vision platform for image and video recognition',
    url: 'https://www.clarifai.com',
    category: ['AI', 'Vision', 'Image', 'Video'],
    logo: [
      'https://www.clarifai.com/favicon.ico',
    ],
    domain: 'clarifai.com',
    tags: ['computer-vision', 'image-recognition', 'video-analysis', 'api']
  },
  {
    id: 'landing-ai',
    name: 'Landing AI',
    description: 'Computer vision platform by Andrew Ng',
    url: 'https://landing.ai',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://landing.ai/favicon.ico',
    ],
    domain: 'landing.ai',
    tags: ['computer-vision', 'manufacturing', 'defect-detection', 'inspection']
  },
  {
    id: 'viso-ai',
    name: 'Viso Suite',
    description: 'No-code computer vision platform',
    url: 'https://viso.ai',
    category: ['AI', 'Vision', 'Productivity'],
    logo: [
      'https://viso.ai/favicon.ico',
    ],
    domain: 'viso.ai',
    tags: ['computer-vision', 'no-code', 'enterprise', 'deployment']
  },
  {
    id: 'scale-ai',
    name: 'Scale AI',
    description: 'Data labeling and computer vision platform',
    url: 'https://scale.com',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.VgupHGSvLomXPNVYkFbxjQAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=22374688df9329ed67e36905f365839dd60b7f39593c572178442a20267a3904&ipo=images',
      'https://scale.com/static/images/scale-logo-icon.svg',
      'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1488261012/idhq6ywhqwpikdrgdl1m.png',
    ],
    domain: 'scale.com',
    tags: ['computer-vision', 'data-labeling', 'annotation', 'training-data']
  },
  {
    id: 'deepomatic',
    name: 'Deepomatic',
    description: 'Visual automation platform',
    url: 'https://www.deepomatic.com',
    category: ['AI', 'Vision', 'Automation'],
    logo: [
      'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_1/v1514419613/cjbnx92bpyspqmwdmdgk.png',
      'https://www.deepomatic.com/apple-touch-icon.png',
    ],
    domain: 'deepomatic.com',
    tags: ['computer-vision', 'visual-automation', 'recognition', 'enterprise']
  },
  {
    id: 'segments-ai',
    name: 'Segments.ai',
    description: 'Training data platform for computer vision',
    url: 'https://segments.ai',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://images.crunchbase.com/image/upload/c_pad,h_256,w_256,f_auto,q_auto:eco,dpr_2/v1633527074/vk6ltshffgdybjhtf0yj.png',
      'https://segments.ai/assets/images/logo-symbol.svg',
    ],
    domain: 'segments.ai',
    tags: ['computer-vision', 'segmentation', 'labeling', 'annotation']
  },
  {
    id: 'supervisely',
    name: 'Supervisely',
    description: 'Computer vision platform for data labeling',
    url: 'https://supervise.ly',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.6pvOxkYHZ16sm1v1oD65kgAAAA%3Fpid%3DApi&f=1&ipt=a2f9a5d7fa7ca68fe3e76f8217f712eba49a1796f66cf8c93530c61c8a0dfcf1&ipo=images',
      'https://avatars.githubusercontent.com/u/25091304?s=200&v=4',
    ],
    domain: 'supervise.ly',
    tags: ['computer-vision', 'annotation', 'labeling', 'dataset']
  },
  {
    id: 'paperspace',
    name: 'Paperspace',
    description: 'Cloud platform for computer vision ML',
    url: 'https://www.paperspace.com',
    category: ['AI', 'Vision', 'Développement', 'Cloud'],
    logo: [
      'https://www.paperspace.com/favicon.ico',
    ],
    domain: 'paperspace.com',
    tags: ['computer-vision', 'gpu', 'cloud', 'ml', 'training']
  },
  {
    id: 'nanonets',
    name: 'Nanonets',
    description: 'OCR and computer vision APIs',
    url: 'https://nanonets.com',
    category: ['AI', 'Vision', 'API'],
    logo: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.igpBY8t72DffqOSXWXaEggHaHa%3Fpid%3DApi&f=1&ipt=669f136c051c0a0ea7ad84d578005e4165aebd43ca34a108399bbcbf03ab4890&ipo=images',
    domain: 'nanonets.com',
    tags: ['computer-vision', 'ocr', 'document-ai', 'api']
  },
  {
    id: 'chooch',
    name: 'Chooch AI',
    description: 'Computer vision AI platform',
    url: 'https://chooch.com',
    category: ['AI', 'Vision'],
    logo: [
      'https://chooch.com/favicon.ico',
    ],
    domain: 'chooch.com',
    tags: ['computer-vision', 'object-detection', 'facial-recognition', 'video-analysis']
  },
  {
    id: 'v7',
    name: 'V7',
    description: 'Training data platform for computer vision',
    url: 'https://www.v7labs.com',
    category: ['AI', 'Vision', 'Data'],
    logo: [
      'https://www.v7labs.com/favicon.ico',
    ],
    domain: 'v7labs.com',
    tags: ['computer-vision', 'annotation', 'training-data', 'auto-annotation']
  },

  // Video & Audio
  {
    id: 'runway',
    name: 'Runway',
    description: 'AI video editing',
    url: 'https://app.runwayml.com',
    category: ['AI', 'Video', 'Image'],
    logo: 'https://runwayml.com/favicon.ico',
    domain: 'runwayml.com',
    tags: ['video', 'editing', 'generation', 'creative']
  },
  {
    id: 'elevenlabs',
    name: 'ElevenLabs',
    description: 'AI voice generation',
    url: 'https://elevenlabs.io/app',
    category: ['AI', 'Audio', 'Voice'],
    logo: 'https://elevenlabs.io/favicon.ico',
    domain: 'elevenlabs.io',
    tags: ['voice', 'audio', 'speech', 'tts']
  },
  {
    id: 'descript',
    name: 'Descript',
    description: 'AI video & podcast editor',
    url: 'https://www.descript.com/login',
    category: ['AI', 'Video', 'Audio'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.tuGDy7NZfoY3IRNnaaijwQAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=2063f82d8ac67468645406260d1b69de152c4909f6b6382bb114734101681d6b&ipo=images',
      'https://www.descript.com/favicon.ico',
    ],
    domain: 'descript.com',
    tags: ['video', 'audio', 'editing', 'podcast']
  },
  {
    id: 'autotrim',
    name: 'AutoTrim',
    description: 'Suppression automatique des silences dans vos montages vidéo',
    url: 'https://www.autotrim.app/fr',
    category: ['AI', 'Video', 'Editor'],
    logo: [
      'https://www.autotrim.app/favicon.ico',
    ],
    domain: 'autotrim.app',
    tags: ['video', 'editing', 'trim', 'silence', 'automation', 'local']
  },
  {
    id: 'synthesia',
    name: 'Synthesia',
    description: 'AI video with avatars',
    url: 'https://app.synthesia.io',
    category: ['AI', 'Video'],
    logo: 'https://www.synthesia.io/favicon.ico',
    domain: 'synthesia.io',
    tags: ['video', 'avatar', 'generation']
  },
  {
    id: 'capcut',
    name: 'CapCut',
    description: 'Free video editor for all platforms',
    url: 'https://www.capcut.com',
    category: ['Video', 'Editor'],
    logo: [
      'https://lf16-web-buz.capcut.com/obj/capcut-web-buz-us/common/images/icon.png',
      'https://www.capcut.com/favicon.ico',
    ],
    domain: 'capcut.com',
    tags: ['video', 'editing', 'free', 'tiktok', 'mobile']
  },
  {
    id: 'davinci-resolve',
    name: 'DaVinci Resolve',
    description: 'Professional video editing software',
    url: 'https://www.blackmagicdesign.com/products/davinciresolve',
    category: ['Video', 'Editor'],
    logo: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/DaVinci_Resolve_17_logo.svg/512px-DaVinci_Resolve_17_logo.svg.png',
      'https://www.blackmagicdesign.com/favicon.ico',
    ],
    domain: 'blackmagicdesign.com',
    tags: ['video', 'editing', 'professional', 'color-grading', 'free']
  },
  {
    id: 'premiere-pro',
    name: 'Adobe Premiere Pro',
    description: 'Industry-standard video editing',
    url: 'https://www.adobe.com/products/premiere.html',
    category: ['Video', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.eUYuAovWiHxmBCqmOsubbQHaGx%3Fcb%3D12%26pid%3DApi&f=1&ipt=4e77b47a0fe567dadb2c6c49f142a749262015733cedfd4ca59445b29df3f326&ipo=images',
      'https://www.adobe.com/favicon.ico',
    ],
    domain: 'adobe.com',
    tags: ['video', 'editing', 'professional', 'adobe']
  },
  {
    id: 'final-cut-pro',
    name: 'Final Cut Pro',
    description: 'Professional video editing for Mac',
    url: 'https://www.apple.com/final-cut-pro/',
    category: ['Video', 'Editor'],
    logo: [
      'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Final_Cut_Pro_Logo.svg/512px-Final_Cut_Pro_Logo.svg.png',
      'https://www.apple.com/favicon.ico',
    ],
    domain: 'apple.com',
    tags: ['video', 'editing', 'professional', 'mac', 'apple']
  },
  {
    id: 'filmora',
    name: 'Filmora',
    description: 'Easy video editing for creators',
    url: 'https://filmora.wondershare.com',
    category: ['Video', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.wsn9KnnJZ78vmC2ANq8k6QAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=08d86d2f343843e99121cfa80608862ffc113a4379d0be24d52a91e55435d081&ipo=images',
      'https://filmora.wondershare.com/favicon.ico',
    ],
    domain: 'wondershare.com',
    tags: ['video', 'editing', 'beginner', 'effects']
  },
  {
    id: 'shotcut',
    name: 'Shotcut',
    description: 'Free open-source video editor',
    url: 'https://shotcut.org',
    category: ['Video', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.KfONfv8_RDsgloCLcGpPoQHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=669ae5a8bcbcaf3d42cc38b904ae0087c3dbaa9c8d0232b318e0fdb2c5945b55&ipo=images',
      'https://shotcut.org/assets/img/media/shotcut-logo-64.png',
    ],
    domain: 'shotcut.org',
    tags: ['video', 'editing', 'free', 'open-source']
  },
  {
    id: 'openshot',
    name: 'OpenShot',
    description: 'Free and easy video editor',
    url: 'https://www.openshot.org',
    category: ['Video', 'Editor'],
    logo: 'https://www.openshot.org/static/img/favicon.png',
    domain: 'openshot.org',
    tags: ['video', 'editing', 'free', 'open-source', 'simple']
  },
  {
    id: 'kdenlive',
    name: 'Kdenlive',
    description: 'Open-source video editor',
    url: 'https://kdenlive.org',
    category: ['Video', 'Editor'],
    logo: [
      'https://kdenlive.org/wp-content/uploads/2020/02/kdenlive-logo.png',
      'https://kdenlive.org/favicon.ico',
    ],
    domain: 'kdenlive.org',
    tags: ['video', 'editing', 'free', 'open-source', 'linux']
  },
  {
    id: 'lightworks',
    name: 'Lightworks',
    description: 'Professional video editing software',
    url: 'https://www.lwks.com',
    category: ['Video', 'Editor'],
    logo: [
      'https://cdn.lwks.com/img/logos/lwks_logo_blue_512x512.png',
      'https://www.lwks.com/favicon.ico',
    ],
    domain: 'lwks.com',
    tags: ['video', 'editing', 'professional', 'free']
  },
  {
    id: 'hitfilm',
    name: 'HitFilm',
    description: 'Video editing and VFX software',
    url: 'https://fxhome.com/hitfilm',
    category: ['Video', 'Editor'],
    logo: 'https://fxhome.com/favicon.ico',
    domain: 'fxhome.com',
    tags: ['video', 'editing', 'vfx', 'effects', 'free']
  },
  {
    id: 'after-effects',
    name: 'Adobe After Effects',
    description: 'Motion graphics and VFX',
    url: 'https://www.adobe.com/products/aftereffects.html',
    category: ['Video', 'Editor'],
    logo: [
      'https://www.adobe.com/content/dam/cc/us/en/products/ccoverview/after_effects_cc_app_RGB.svg',
      'https://www.adobe.com/favicon.ico',
    ],
    domain: 'adobe.com',
    tags: ['video', 'motion-graphics', 'vfx', 'effects', 'adobe']
  },
  {
    id: 'photoshop',
    name: 'Adobe Photoshop',
    description: 'Professional photo editing',
    url: 'https://www.adobe.com/products/photoshop.html',
    category: ['Image', 'Editor'],
    logo: [
      'https://www.adobe.com/content/dam/cc/us/en/products/ccoverview/photoshop_cc_app_RGB.svg',
      'https://www.adobe.com/favicon.ico',
    ],
    domain: 'adobe.com',
    tags: ['photo', 'editing', 'professional', 'adobe', 'design']
  },
  {
    id: 'lightroom',
    name: 'Adobe Lightroom',
    description: 'Photo editing and organization',
    url: 'https://www.adobe.com/products/photoshop-lightroom.html',
    category: ['Image', 'Editor'],
    logo: [
      'https://www.adobe.com/content/dam/cc/us/en/products/ccoverview/lightroom_cc_app_RGB.svg',
      'https://www.adobe.com/favicon.ico',
    ],
    domain: 'adobe.com',
    tags: ['photo', 'editing', 'workflow', 'adobe', 'raw']
  },
  {
    id: 'gimp',
    name: 'GIMP',
    description: 'Free open-source image editor',
    url: 'https://www.gimp.org',
    category: ['Image', 'Editor'],
    logo: [
      'https://www.gimp.org/images/frontpage/wilber-big.png',
      'https://www.gimp.org/favicon.ico',
    ],
    domain: 'gimp.org',
    tags: ['photo', 'editing', 'free', 'open-source']
  },
  {
    id: 'photopea',
    name: 'Photopea',
    description: 'Free online photo editor',
    url: 'https://www.photopea.com',
    category: ['Image', 'Editor'],
    logo: 'https://www.photopea.com/promo/icon512.png',
    domain: 'photopea.com',
    tags: ['photo', 'editing', 'free', 'online', 'psd']
  },
  {
    id: 'canva',
    name: 'Canva',
    description: 'Graphic design platform',
    url: 'https://www.canva.com',
    category: ['Image', 'Editor', 'Design'],
    logo: [
      'https://static.canva.com/web/images/12487a1e0770d29351bd4ce4f87ec8fe.svg',
      'https://www.canva.com/favicon.ico',
    ],
    domain: 'canva.com',
    tags: ['design', 'photo', 'graphics', 'templates', 'easy']
  },
  {
    id: 'pixlr',
    name: 'Pixlr',
    description: 'Free online photo editor',
    url: 'https://pixlr.com',
    category: ['Image', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.explicit.bing.net%2Fth%2Fid%2FOIP.cBef025Qyr7UwPE9aoTeUQHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=ada35b246132f3d2978ba6b960e36fd3c139836a624e2dabd8d2656e32dc5106&ipo=images',
      'https://pixlr.com/static/pixlr-logo.svg',
      'https://pixlr.com/favicon.ico',
    ],
    domain: 'pixlr.com',
    tags: ['photo', 'editing', 'free', 'online']
  },
  {
    id: 'affinity-photo',
    name: 'Affinity Photo',
    description: 'Professional photo editing software',
    url: 'https://affinity.serif.com/photo/',
    category: ['Image', 'Editor'],
    logo: 'https://affinity.serif.com/favicon.ico',
    domain: 'serif.com',
    tags: ['photo', 'editing', 'professional', 'affordable']
  },
  {
    id: 'krita',
    name: 'Krita',
    description: 'Free digital painting software',
    url: 'https://krita.org',
    category: ['Image', 'Editor', 'Art'],
    logo: [
      'https://krita.org/images/krita-logo.svg',
      'https://krita.org/favicon.ico',
    ],
    domain: 'krita.org',
    tags: ['painting', 'drawing', 'art', 'free', 'open-source']
  },
  {
    id: 'darktable',
    name: 'Darktable',
    description: 'Open-source photography workflow',
    url: 'https://www.darktable.org',
    category: ['Image', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.KSemfcNJJn8U8IZpPp6AnAHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=830c4c267a8532a54776ff3937f1467a2005eb57846e852e600ff0cb98129756&ipo=images',
      'https://www.darktable.org/icon-512.png',
      'https://www.darktable.org/favicon.ico',
    ],
    domain: 'darktable.org',
    tags: ['photo', 'raw', 'workflow', 'free', 'open-source']
  },
  {
    id: 'rawtherapee',
    name: 'RawTherapee',
    description: 'Free RAW image processor',
    url: 'https://www.rawtherapee.com',
    category: ['Image', 'Editor'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.EB0UDLINGXFXeMX9l5buSQHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=bde52e14825401a6f8f0a853880058de90ad35f0b141cdc99cbed4041ebe55c7&ipo=images',
      'https://www.rawtherapee.com/favicon.ico',
    ],
    domain: 'rawtherapee.com',
    tags: ['photo', 'raw', 'processing', 'free', 'open-source']
  },
  {
    id: 'inkscape',
    name: 'Inkscape',
    description: 'Free vector graphics editor',
    url: 'https://inkscape.org',
    category: ['Image', 'Editor', 'Design'],
    logo: [
      'https://media.inkscape.org/static/images/inkscape-logo.svg',
      'https://inkscape.org/favicon.ico',
    ],
    domain: 'inkscape.org',
    tags: ['vector', 'graphics', 'svg', 'free', 'open-source']
  },
  {
    id: 'remove-bg',
    name: 'Remove.bg',
    description: 'AI background remover',
    url: 'https://www.remove.bg',
    category: ['AI', 'Image', 'Editor'],
    logo: 'https://www.remove.bg/favicon.ico',
    domain: 'remove.bg',
    tags: ['background-removal', 'ai', 'photo', 'editing']
  },
  {
    id: 'topaz-labs',
    name: 'Topaz Labs',
    description: 'AI-powered photo enhancement',
    url: 'https://www.topazlabs.com',
    category: ['AI', 'Image', 'Editor'],
    logo: 'https://www.topazlabs.com/favicon.ico',
    domain: 'topazlabs.com',
    tags: ['ai', 'photo', 'enhancement', 'upscaling']
  },

  // Documentation & Learning
  {
    id: 'phind',
    name: 'Phind',
    description: 'AI search for developers',
    url: 'https://www.phind.com',
    category: ['AI', 'Développement', 'Documentation', 'Search'],
    logo: 'https://www.phind.com/images/favicon.png',
    domain: 'phind.com',
    tags: ['search', 'code', 'documentation', 'developers']
  },
  {
    id: 'devdocs',
    name: 'DevDocs',
    description: 'API documentation browser',
    url: 'https://devdocs.io',
    category: ['AI', 'Documentation'],
    logo: 'https://devdocs.io/images/apple-icon-76.png',
    domain: 'devdocs.io',
    tags: ['documentation', 'api', 'reference']
  },
  {
    id: 'stack-overflow',
    name: 'Stack Overflow',
    description: 'Developer Q&A community',
    url: 'https://stackoverflow.com',
    category: ['AI', 'Documentation', 'Community'],
    logo: 'https://cdn.sstatic.net/Sites/stackoverflow/Img/apple-touch-icon.png',
    domain: 'stackoverflow.com',
    tags: ['qa', 'community', 'documentation']
  },
  {
    id: 'readme-ai',
    name: 'Readme.so',
    description: 'README generator',
    url: 'https://readme.so',
    category: ['AI', 'Documentation', 'Développement'],
    logo: 'https://readme.so/favicon.ico',
    domain: 'readme.so',
    tags: ['readme', 'documentation', 'markdown']
  },

  // Design & UI/UX
  {
    id: 'figma-ai',
    name: 'Figma AI',
    description: 'Design tool with AI',
    url: 'https://www.figma.com/make/BnGAtdT4R4NPACn0sSqnfa/Untitled?node-id=0-4&t=DCC6ajqyHI6RFzlb-0',
    category: ['AI', 'Design'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Flogospng.org%2Fdownload%2Ffigma%2Ffigma-512.png&f=1&nofb=1&ipt=64753d820122f1ca1c46611a8993fcda9f1efb22c81c83e279d31eb654601352',
      'https://static.figma.com/app/icon/1/favicon.png',
    ],
    domain: 'figma.com',
    tags: ['design', 'ui', 'ux', 'prototype'],
    executables: {
      windows: ['Figma', 'FigmaAgent'],
      macos: ['com.figma.Desktop', 'Figma'],
      linux: ['figma-linux', 'figma'],
    }
  },
  {
    id: 'uizard',
    name: 'Uizard',
    description: 'AI UI design from text',
    url: 'https://uizard.io/',
    category: ['AI', 'Design'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.halvy8jZl0VjPNFTYHp7XQAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=b6b4405b5eefc8bd6c590b89a830cf7d2aa5a6d02a1417251458ccfe6d663596&ipo=images',
      'https://uizard.io/favicon.ico',
    ],
    domain: 'uizard.io',
    tags: ['design', 'ui', 'prototype', 'ai']
  },
  {
    id: 'framer',
    name: 'Framer',
    description: 'Website builder with AI',
    url: 'https://www.framer.com/projects',
    category: ['AI', 'Design', 'Web'],
    logo: 'https://www.framer.com/favicon.ico',
    domain: 'framer.com',
    tags: ['design', 'website', 'no-code']
  },
  {
    id: 'khroma',
    name: 'Khroma',
    description: 'AI color palette tool',
    url: 'http://khroma.co/generator',
    category: ['AI', 'Design'],
    logo: [
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.bookmarks.design%2Fmedia%2Fimage%2Fkhroma.jpg&f=1&nofb=1&ipt=b04f3696270a0bade75f0b2960db1aff265ef53affc302a2827cf26efdf43a8c"
    ],
    domain: 'khroma.co',
    tags: ['color', 'design', 'palette']
  },

  // Data & Analytics
  {
    id: 'julius',
    name: 'Julius AI',
    description: 'AI data analyst',
    url: 'https://julius.ai/',
    category: ['AI', 'Data', 'Analytics'],
    logo: 'https://julius.ai/favicon.ico',
    domain: 'julius.ai',
    tags: ['data', 'analytics', 'visualization']
  },
  {
    id: 'noteable',
    name: 'Noteable',
    description: 'Data notebooks with AI',
    url: 'https://app.noteable.io',
    category: ['AI', 'Data', 'Développement'],
    logo: 'https://noteable.io/favicon.ico',
    domain: 'noteable.io',
    tags: ['data', 'notebook', 'jupyter', 'collaborative']
  },

  // Productivity & Automation
  {
    id: 'zapier-ai',
    name: 'Zapier AI',
    description: 'AI-powered automation',
    url: 'https://zapier.com/app/dashboard',
    category: ['AI', 'Productivity', 'Automation'],
    logo: [
      'https://cdn.zapier.com/ssr/58bd87318fa5d56e5e00a0db6cd1ee89b17e10e5/_next/static/images/favicon-76d3ffdc8a680e5ce6e2b329b8c848ff.ico',
      'https://zapier.com/favicon.ico',
    ],
    domain: 'zapier.com',
    tags: ['automation', 'workflow', 'integration']
  },
  {
    id: 'otter',
    name: 'Otter.ai',
    description: 'AI meeting transcription',
    url: 'https://otter.ai/login',
    category: ['AI', 'Productivity', 'Audio'],
    logo: 'https://otter.ai/favicon.ico',
    domain: 'otter.ai',
    tags: ['transcription', 'meetings', 'notes']
  },
  {
    id: 'mem',
    name: 'Mem',
    description: 'AI note-taking',
    url: 'https://get.mem.ai',
    category: ['AI', 'Productivity', 'Writing'],
    logo: 'https://get.mem.ai/favicon.ico',
    domain: 'mem.ai',
    tags: ['notes', 'productivity', 'knowledge']
  },

  // Translation & Language
  {
    id: 'deepl',
    name: 'DeepL',
    description: 'AI translation service',
    url: 'https://www.deepl.com/translator',
    category: ['AI', 'Translation'],
    logo: 'https://www.deepl.com/img/favicon/favicon_96.png',
    domain: 'deepl.com',
    tags: ['translation', 'language', 'multilingual']
  },
  {
    id: 'linguee',
    name: 'Linguee',
    description: 'Dictionary with examples',
    url: 'https://www.linguee.com',
    category: ['AI', 'Translation', 'Documentation'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%2Fid%2FOIP.atnSKYalzVNtUJC9rwG8PQHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=89c69ea0c1175c18789ec8d25985af95e9d380496f9470de0bc87c513b6e5f83',
      'https://www.linguee.com/favicon.ico',
    ],
    domain: 'linguee.com',
    tags: ['translation', 'dictionary', 'context']
  },

  // 3D & Graphics
  {
    id: 'spline',
    name: 'Spline AI',
    description: '3D design with AI',
    url: 'https://app.spline.design',
    category: ['AI', '3D', 'Design'],
    logo: 'https://spline.design/favicon.png',
    domain: 'spline.design',
    tags: ['3d', 'design', 'modeling', 'ai']
  },
  {
    id: 'luma-ai',
    name: 'Luma AI',
    description: '3D capture tool',
    url: 'https://lumalabs.ai/dream-machine',
    category: ['AI', '3D', 'Image'],
    logo: [
      'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"%3E%3Ctext x="100" y="100" text-anchor="middle" dominant-baseline="middle" font-size="120" fill="white"%3EL%3C/text%3E%3C/svg%3E',
      'https://www.google.com/s2/favicons?domain=lumalabs.ai&sz=256',
    ],
    domain: 'lumalabs.ai',
    tags: ['3d', 'capture', 'photogrammetry']
  },

  // Specialized Tools
  {
    id: 'huggingface',
    name: 'Hugging Face',
    description: 'ML models platform',
    url: 'https://huggingface.co',
    category: ['AI', 'Développement', 'Research', 'Multi-tool'],
    logo: 'https://huggingface.co/favicon.ico',
    domain: 'huggingface.co',
    tags: ['ml', 'models', 'datasets', 'research']
  },
  {
    id: 'replicate',
    name: 'Replicate',
    description: 'Run ML models via API',
    url: 'https://replicate.com',
    category: ['AI', 'Développement', 'Multi-tool'],
    logo: 'https://replicate.com/favicon.ico',
    domain: 'replicate.com',
    tags: ['ml', 'api', 'models', 'open-source']
  },
  {
    id: 'civitai',
    name: 'CivitAI',
    description: 'AI art models community',
    url: 'https://civitai.com',
    category: ['AI', 'Image', 'Community'],
    logo: 'https://civitai.com/favicon.ico',
    domain: 'civitai.com',
    tags: ['models', 'stable-diffusion', 'community']
  },
  {
    id: 'vercel-ai',
    name: 'Vercel AI',
    description: 'Build AI apps',
    url: 'https://ai-sdk.dev/playground',
    category: ['AI', 'Développement', 'Web'],
    logo: 'https://vercel.com/favicon.ico',
    domain: 'vercel.com',
    tags: ['framework', 'sdk', 'development', 'web']
  },
  {
    id: 'anthropic',
    name: 'Anthropic Console',
    description: 'Claude API access',
    url: 'https://console.anthropic.com',
    category: ['AI', 'Développement', 'API'],
    logo: [
      'https://claude.ai/images/claude_app_icon.png',
      'https://www.anthropic.com/images/icons/safari-pinned-tab.svg',
    ],
    domain: 'anthropic.com',
    tags: ['api', 'claude', 'development']
  },
  {
    id: 'openai-platform',
    name: 'OpenAI Platform',
    description: 'OpenAI APIs',
    url: 'https://platform.openai.com',
    category: ['AI', 'Développement', 'API'],
    logo: [
      'https://cdn.oaistatic.com/_next/static/media/apple-touch-icon.82af6fe1.png',
      'https://openai.com/favicon.ico',
    ],
    domain: 'openai.com',
    tags: ['api', 'openai', 'development', 'gpt']
  },
  {
    id: 'notebooklm',
    name: 'NotebookLM',
    description: 'AI research assistant by Google',
    url: 'https://notebooklm.google.com',
    category: ['AI', 'Research', 'Writing', 'Productivity'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.M9DglXaU5X3Je4-QngqgmAHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=cdf7c0c3ab5a3157d8213d68be2c4596da1a0cb89bde37acb82dbde4422a6e8e&ipo=images',
      'https://notebooklm.google.com/favicon.ico',
    ],
    domain: 'notebooklm.google.com',
    tags: ['research', 'notes', 'google', 'ai', 'documents', 'learning']
  },
  {
    id: 'codecademy',
    name: 'Codecademy',
    description: 'Interactive coding courses and tutorials',
    url: 'https://www.codecademy.com/catalog',
    category: ['Développement', 'Productivity'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fyt3.ggpht.com%2Fa%2FAATXAJykVH9taajY7C7frBCb-_BCVV5HYcmstwBAyA%3Ds900-c-k-c0xffffffff-no-rj-mo&f=1&nofb=1&ipt=111f8dab3b81a9d6c362e11ce4ae8aa3c32c7afbb8d93a2d6d12151ba8c056fb',
      'https://www.codecademy.com/favicon.ico',
    ],
    domain: 'codecademy.com',
    tags: ['coding', 'learning', 'tutorial', 'education', 'programming', 'courses']
  },
  {
    id: 'nordvpn',
    name: 'NordVPN',
    description: 'Fast and secure VPN service',
    url: 'https://my.nordaccount.com',
    category: ['Security', 'Privacy'],
    logo: [
      'https://companieslogo.com/img/orig/nordvpn-61aca120.png?t=1720244494',
      'https://nordvpn.com/favicon.ico',
    ],
    domain: 'nordvpn.com',
    tags: ['vpn', 'security', 'privacy', 'encryption', 'protection']
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: 'Video sharing platform',
    url: 'https://www.youtube.com',
    category: ['Video', 'Community'],
    logo: [
      'data:image/svg+xml,%3Csvg width="256px" height="180px" viewBox="0 0 256 180" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid"%3E%3Cg%3E%3Cpath d="M250.346231,28.0746923 C247.358133,17.0320558 238.732098,8.40602109 227.689461,5.41792308 C207.823743,0 127.868333,0 127.868333,0 C127.868333,0 47.9129229,0.164179487 28.0472049,5.58210256 C17.0045684,8.57020058 8.37853373,17.1962353 5.39043571,28.2388718 C-0.618533519,63.5374615 -2.94988224,117.322662 5.5546152,151.209308 C8.54271322,162.251944 17.1687479,170.877979 28.2113844,173.866077 C48.0771024,179.284 128.032513,179.284 128.032513,179.284 C128.032513,179.284 207.987923,179.284 227.853641,173.866077 C238.896277,170.877979 247.522312,162.251944 250.51041,151.209308 C256.847738,115.861464 258.801474,62.1091 250.346231,28.0746923 Z" fill="%23FF0000"/%3E%3Cpolygon fill="%23FFFFFF" points="102.420513 128.06 168.749025 89.642 102.420513 51.224"/%3E%3C/g%3E%3C/svg%3E',
      'https://www.youtube.com/favicon.ico',
    ],
    domain: 'youtube.com',
    tags: ['video', 'streaming', 'content', 'media', 'entertainment']
  },
  {
    id: 'protonmail',
    name: 'Proton Mail',
    description: 'Encrypted email service',
    url: 'https://mail.proton.me/',
    category: ['Security', 'Privacy', 'Productivity'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.AqGnZHWQN3DW7L_c6rW4_wHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=9749337b9cd7717cf945f8b3a0c4421a1cc8aab0473bf981e81f468e8ed5f9da',
      'https://proton.me/favicon.ico',
    ],
    domain: 'proton.me',
    tags: ['email', 'encrypted', 'privacy', 'secure', 'mail']
  },
  {
    id: 'protonvpn',
    name: 'Proton VPN',
    description: 'Secure VPN by Proton',
    url: 'https://account.protonvpn.com/',
    category: ['Security', 'Privacy'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.NS6gVUQIYeL4MIU33vhgFgHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=e3752a67fa3e4f43ff7fccfe82041be62aab8e6aae60b108bf35cca214762323&ipo=images',
      'https://protonvpn.com/favicon.ico',
    ],
    domain: 'protonvpn.com',
    tags: ['vpn', 'security', 'privacy', 'encryption', 'proton']
  },
  {
    id: 'protondrive',
    name: 'Proton Drive',
    description: 'Encrypted cloud storage',
    url: 'https://drive.proton.me/',
    category: ['Security', 'Privacy', 'Productivity'],
    logo: [
      'https://play-lh.googleusercontent.com/AvaTTF1BKzC6BiGR9BI6i6_Cyow4OTl_xRrjZY1pUIxQBMO2zRJtRDralcmm-V5IRQY=s96',
      'https://proton.me/favicon.ico',
    ],
    domain: 'proton.me',
    tags: ['cloud', 'storage', 'encrypted', 'privacy', 'files']
  },
  {
    id: 'protoncalendar',
    name: 'Proton Calendar',
    description: 'Encrypted calendar',
    url: 'https://calendar.proton.me/',
    category: ['Security', 'Privacy', 'Productivity'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.qY-tHlj-kxRSeorWTf5DrwHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=24b1072218c3bc7153d67da5437802c1e7a332570590c476393cb7614fbd7d8e',
      'https://proton.me/favicon.ico',
    ],
    domain: 'proton.me',
    tags: ['calendar', 'encrypted', 'privacy', 'scheduling']
  },
  {
    id: 'protonpass',
    name: 'Proton Pass',
    description: 'Encrypted password manager',
    url: 'https://pass.proton.me/',
    category: ['Security', 'Privacy', 'Productivity'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%2Fid%2FOIP.Z3L1ozcxSKEe0L1_ehbFcgHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=aacf0fc9ab0c18168735020fd2a3414a12698b61ececa681787f5c5c71534ee9&ipo=images',
      'https://proton.me/favicon.ico',
    ],
    domain: 'proton.me',
    tags: ['password', 'manager', 'encrypted', 'privacy', 'security']
  },

  // Google Services
  {
    id: 'google-search',
    name: 'Google Search',
    description: 'Most popular search engine',
    url: 'https://www.google.com',
    category: ['Research', 'Productivity'],
    logo: [
      'https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png',
    ],
    domain: 'google.com',
    tags: ['search', 'google', 'web']
  },
  {
    id: 'gmail',
    name: 'Gmail',
    description: 'Email service by Google',
    url: 'https://mail.google.com',
    category: ['Productivity', 'Communication'],
    logo: [
      'https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico',
    ],
    domain: 'google.com',
    tags: ['email', 'google', 'mail']
  },
  {
    id: 'google-drive',
    name: 'Google Drive',
    description: 'Cloud storage and file sharing',
    url: 'https://drive.google.com',
    category: ['Productivity', 'Storage'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/drive_2020q4_48dp.png',
      'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_96dp.png',
    ],
    domain: 'google.com',
    tags: ['storage', 'cloud', 'google', 'files']
  },
  {
    id: 'google-docs',
    name: 'Google Docs',
    description: 'Online document editor',
    url: 'https://docs.google.com',
    category: ['Writing', 'Productivity', 'Documentation'],
    logo: [
      'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico',
    ],
    domain: 'google.com',
    tags: ['docs', 'writing', 'google', 'editor']
  },
  {
    id: 'google-sheets',
    name: 'Google Sheets',
    description: 'Online spreadsheet editor',
    url: 'https://sheets.google.com',
    category: ['Data', 'Productivity'],
    logo: [
      'https://ssl.gstatic.com/docs/spreadsheets/favicon3.ico',
    ],
    domain: 'google.com',
    tags: ['spreadsheet', 'data', 'google', 'excel']
  },
  {
    id: 'google-slides',
    name: 'Google Slides',
    description: 'Online presentation maker',
    url: 'https://slides.google.com',
    category: ['Design', 'Productivity'],
    logo: 'https://www.gstatic.com/images/branding/product/2x/slides_2020q4_48dp.png',
    domain: 'google.com',
    tags: ['presentation', 'slides', 'google', 'powerpoint']
  },
  {
    id: 'google-meet',
    name: 'Google Meet',
    description: 'Video conferencing service',
    url: 'https://meet.google.com',
    category: ['Communication', 'Productivity'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/meet_2020q4_48dp.png',
      'https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-96dp/logo_meet_2020q4_color_2x_web_96dp.png',
    ],
    domain: 'google.com',
    tags: ['video', 'meeting', 'google', 'conference']
  },
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Online calendar and scheduling',
    url: 'https://calendar.google.com',
    category: ['Productivity'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/calendar_2020q4_48dp.png',
      'https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png',
    ],
    domain: 'google.com',
    tags: ['calendar', 'schedule', 'google', 'planning']
  },
  {
    id: 'google-photos',
    name: 'Google Photos',
    description: 'Photo storage and organization',
    url: 'https://photos.google.com',
    category: ['Image', 'Storage'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/photos_48dp.png',
      'https://ssl.gstatic.com/social/photosui/images/logo/favicon_alum_n_64dp.png',
    ],
    domain: 'google.com',
    tags: ['photos', 'images', 'google', 'storage']
  },
  {
    id: 'google-maps',
    name: 'Google Maps',
    description: 'Maps and navigation service',
    url: 'https://maps.google.com',
    category: ['Productivity', 'Travel'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/maps_96dp.png',
      'https://www.gstatic.com/images/branding/product/1x/maps_48dp.png',
    ],
    domain: 'google.com',
    tags: ['maps', 'navigation', 'google', 'travel']
  },
  {
    id: 'google-translate',
    name: 'Google Translate',
    description: 'Translation service',
    url: 'https://translate.google.com',
    category: ['Translation', 'Productivity'],
    logo: [
      'https://ssl.gstatic.com/translate/favicon.ico',
    ],
    domain: 'google.com',
    tags: ['translation', 'google', 'language']
  },
  {
    id: 'google-keep',
    name: 'Google Keep',
    description: 'Note-taking service',
    url: 'https://keep.google.com',
    category: ['Productivity', 'Writing'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/keep_2020q4_48dp.png',
      'https://ssl.gstatic.com/keep/keep_2020q4v2_48x48.png',
    ],
    domain: 'google.com',
    tags: ['notes', 'google', 'productivity']
  },
  {
    id: 'google-forms',
    name: 'Google Forms',
    description: 'Create surveys and forms',
    url: 'https://forms.google.com',
    category: ['Productivity', 'Data'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/forms_2020q4_48dp.png',
      'https://ssl.gstatic.com/docs/spreadsheets/forms/favicon_qp2.png',
    ],
    domain: 'google.com',
    tags: ['forms', 'survey', 'google']
  },
  {
    id: 'google-classroom',
    name: 'Google Classroom',
    description: 'Online learning platform',
    url: 'https://classroom.google.com',
    category: ['Education', 'Productivity'],
    logo: [
      'https://www.gstatic.com/images/branding/product/2x/classroom_48dp.png',
      'https://ssl.gstatic.com/classroom/favicon.png',
    ],
    domain: 'google.com',
    tags: ['education', 'learning', 'google']
  },

  // Design Resources
  {
    id: 'freepik',
    name: 'Freepik',
    description: 'Free vectors, photos and PSD downloads',
    url: 'https://www.freepik.com',
    category: ['Design', 'Image', 'Art'],
    logo: [
      'https://www.freelogovectors.net/wp-content/uploads/2023/07/freepik-logo-02-freelogovectors.net_.png',
      'https://fp.freepik.com/freepik-web-assets/img/brand/freepik_logo.svg',
      'https://www.freepik.com/apple-touch-icon.png',
      'https://www.freepik.com/favicon.ico',
    ],
    domain: 'freepik.com',
    tags: ['design', 'vectors', 'images', 'resources', 'free']
  },
  {
    id: 'mkdocs',
    name: 'MkDocs',
    description: 'Static site generator for documentation',
    url: 'https://www.mkdocs.org/getting-started/',
    category: ['Documentation', 'Développement', 'Productivity'],
    logo: 'https://squidfunk.github.io/mkdocs-material/assets/logo.png',
    domain: 'mkdocs.org',
    tags: ['documentation', 'static-site', 'markdown', 'open-source', 'generator']
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Platform for version control and collaboration',
    url: 'https://github.com',
    category: ['Développement', 'Productivity', 'Community'],
    logo: 'https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png',
    domain: 'github.com',
    tags: ['git', 'version-control', 'code', 'repository', 'collaboration', 'open-source'],
    executables: {
      windows: ['GitHubDesktop'],
      macos: ['com.github.GitHubClient', 'GitHub Desktop'],
      linux: ['github-desktop'],
    }
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Photo and video sharing social network',
    url: 'https://www.instagram.com',
    category: ['Image', 'Video', 'Community'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.g-fH9F3dGYXFN7IbIDCLPAHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=9d01ff4b0d17c0e99a7c0f6f21c7e9c88767e0ef58c7aa96f1ab91c26a8cbca9&ipo=images',
      'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png',
      'https://www.instagram.com/favicon.ico',
    ],
    domain: 'instagram.com',
    tags: ['social', 'photos', 'video', 'stories', 'sharing', 'social-media']
  },
  {
    id: 'n8n',
    name: 'n8n',
    description: 'Workflow automation tool',
    url: 'https://github.com/n8n-io/n8n#quick-start',
    category: ['Automation', 'Productivity', 'Développement'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.rNZsPUGKf6R4FsQhH8mVrQHaHa%3Fcb%3D12%26pid%3DApi&f=1&ipt=58123bb185775efc7704bbe324ea1ac8f92cf8076990144e6b071519180d16ee&ipo=images',
      'https://n8n.io/favicon.ico',
    ],
    domain: 'n8n.io',
    tags: ['automation', 'workflow', 'integration', 'open-source', 'no-code']
  },

  // Media & Entertainment
  {
    id: 'plex',
    name: 'Plex',
    description: 'Media server for streaming your content',
    url: 'https://www.plex.tv',
    category: ['Media', 'Video', 'Audio', 'Productivity'],
    logo: [
      'https://www.plex.tv/wp-content/themes/plex/assets/img/plex-logo.svg',
      'https://www.plex.tv/favicon.ico',
    ],
    domain: 'plex.tv',
    tags: ['media', 'streaming', 'server', 'movies', 'tv', 'music'],
    executables: {
      windows: ['Plex', 'PlexMediaServer'],
      macos: ['Plex', 'Plex Media Server'],
      linux: ['plex-desktop', '/snap/bin/plex-desktop', 'plexmediaserver', 'plex']
    }
  },

  // Cryptocurrency
  {
    id: 'metamask',
    name: 'MetaMask',
    description: 'Crypto wallet & gateway to blockchain apps',
    url: 'https://metamask.io',
    category: ['Crypto', 'Finance', 'Security'],
    logo: [
      'https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg',
      'https://metamask.io/images/metamask-logo.png',
    ],
    domain: 'metamask.io',
    tags: ['crypto', 'wallet', 'ethereum', 'web3', 'blockchain']
  },
  {
    id: 'coinbase',
    name: 'Coinbase',
    description: 'Cryptocurrency exchange platform',
    url: 'https://www.coinbase.com',
    category: ['Crypto', 'Finance', 'Trading'],
    logo: [
      'https://www.coinbase.com/img/favicon/favicon-96x96.png',
      'https://www.coinbase.com/favicon.ico',
    ],
    domain: 'coinbase.com',
    tags: ['crypto', 'exchange', 'trading', 'bitcoin', 'ethereum']
  },
  {
    id: 'binance',
    name: 'Binance',
    description: 'Global cryptocurrency exchange',
    url: 'https://www.binance.com',
    category: ['Crypto', 'Finance', 'Trading'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.6ZEilXHQ-qqrzrQdk6JiLgAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=e2255f53fa8222bf167a50c9320c3ac19afc4c420d768046e19999c08bce4573&ipo=images',
      'https://bin.bnbstatic.com/static/images/common/favicon.ico',
      'https://www.binance.com/favicon.ico',
    ],
    domain: 'binance.com',
    tags: ['crypto', 'exchange', 'trading', 'binance', 'bnb']
  },
  {
    id: 'ledger',
    name: 'Ledger',
    description: 'Hardware wallet for crypto security',
    url: 'https://www.ledger.com',
    category: ['Crypto', 'Security', 'Finance'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.NxLJSOrGDihgzoz5wDy6-AAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=4c5749bfffa3eaa7594ebca21819c826b913ae9d499690090edeff9698637b88&ipo=images',
      'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger-logo-long.svg',
      'https://www.ledger.com/favicon.ico',
    ],
    domain: 'ledger.com',
    tags: ['crypto', 'hardware-wallet', 'security', 'cold-storage']
  },
  {
    id: 'trust-wallet',
    name: 'Trust Wallet',
    description: 'Multi-chain crypto wallet',
    url: 'https://trustwallet.com',
    category: ['Crypto', 'Finance', 'Security'],
    logo: [
      'https://trustwallet.com/assets/images/media/assets/TWT.png',
      'https://trustwallet.com/favicon.ico',
    ],
    domain: 'trustwallet.com',
    tags: ['crypto', 'wallet', 'mobile', 'multi-chain', 'defi']
  },
  {
    id: 'exodus',
    name: 'Exodus',
    description: 'Multi-currency crypto wallet',
    url: 'https://www.exodus.com',
    category: ['Crypto', 'Finance', 'Security'],
    logo: [
      'https://www.exodus.com/favicon.png',
      'https://www.exodus.com/favicon.ico',
    ],
    domain: 'exodus.com',
    tags: ['crypto', 'wallet', 'desktop', 'mobile', 'multi-currency'],
    executables: {
      windows: ['Exodus'],
      macos: ['Exodus'],
      linux: ['exodus', 'Exodus']
    }
  },
  {
    id: 'kraken',
    name: 'Kraken',
    description: 'Cryptocurrency trading platform',
    url: 'https://www.kraken.com',
    category: ['Crypto', 'Finance', 'Trading'],
    logo: [
      'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%2Fid%2FOIP.ncT6m7b8-hvJzrL5dtZbAQAAAA%3Fcb%3D12%26pid%3DApi&f=1&ipt=6f622db20224a06efcef018707f200b947396a441c1da5cd8452575d92ff4f22&ipo=images',
      'https://assets-global.website-files.com/5e5c6c5e072e35e2b4b1c2ac/60c5f2c9c3f0d50f5f5a4f3f_favicon.png',
      'https://www.kraken.com/favicon.ico',
    ],
    domain: 'kraken.com',
    tags: ['crypto', 'exchange', 'trading', 'bitcoin', 'professional']
  },
  {
    id: 'gomining',
    name: 'GoMining',
    description: 'Cloud Bitcoin mining platform',
    url: 'https://gomining.com/fr',
    category: ['Crypto', 'Finance'],
    logo: [
      'https://gomining.com/favicon.ico',
    ],
    domain: 'gomining.com',
    tags: ['crypto', 'mining', 'bitcoin', 'cloud-mining']
  },
  {
    id: 'revolut',
    name: 'Revolut',
    description: 'Digital banking and financial services',
    url: 'https://www.revolut.com',
    category: ['Finance', 'Crypto', 'Trading'],
    logo: [
      'https://www.revolut.com/favicon.ico',
    ],
    domain: 'revolut.com',
    tags: ['banking', 'finance', 'crypto', 'trading', 'card', 'digital-bank']
  },
  {
    id: 'trade-republic',
    name: 'Trade Republic',
    description: 'Commission-free trading platform',
    url: 'https://www.traderepublic.com',
    category: ['Finance', 'Trading'],
    logo: [
      'https://www.traderepublic.com/favicon.ico',
    ],
    domain: 'traderepublic.com',
    tags: ['trading', 'stocks', 'finance', 'investing', 'broker']
  },
];

export const categories = [
  'All',
  'AI',
  'Chat',
  'Développement',
  'IDE',
  'Image',
  'Video',
  'Audio',
  'Writing',
  'Design',
  'Documentation',
  'Research',
  'Productivity',
  'Translation',
  '3D',
  'Data',
  'Multi-tool',
  'Security',
  'Privacy',
  'Communication',
  'Storage',
  'Education',
  'Travel',
  'Art',
  'Vision',
  'API',
  'Cloud',
  'Automation',
  'Editor',
  'Media',
  'Crypto',
  'Finance',
  'Trading',
];
