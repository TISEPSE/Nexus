/**
 * Type definitions for tool form data and tool operations
 */

/**
 * Form data structure for adding or editing custom tools
 */
export interface ToolFormData {
  name: string;
  description: string;
  url: string;
  category: string[];
  logo: string | string[];
  tags: string[];
  domain?: string;
}

/**
 * Validation result for tool form data
 */
export interface ToolFormValidation {
  isValid: boolean;
  errors: {
    name?: string;
    description?: string;
    url?: string;
    category?: string;
    logo?: string;
  };
}

/**
 * Props for tool editing operations
 */
export interface ToolEditProps {
  toolId: string;
  toolData: ToolFormData;
}
