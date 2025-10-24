export const templateMappings: Record<string, string[]> = {
  all: [], // Empty array = show all without highlighting

  designer: [
    'Design',
    'Image',
    'Video',
    'Art',
    '3D',
    'Editing',
  ],

  developer: [
    'Développement',
    'AI',
    'Documentation',
    'API',
    'Cloud',
    'Editor',
    'IDE',
  ],

  'content-creator': [
    'Video',
    'Audio',
    'Writing',
    'Image',
    'Voice',
    'Editing',
  ],

  marketer: [
    'Marketing',
    'Writing',
    'Analytics',
    'Data',
    'Productivity',
  ],

  trader: [
    'Crypto',
    'Finance',
    'Trading',
  ],

  'data-analyst': [
    'Data',
    'AI',
    'Research',
    'Productivity',
    'Vision',
  ],

  '3d-artist': [
    '3D',
    'Design',
    'Art',
    'Image',
    'Video',
  ],

  'video-editor': [
    'Video',
    'Audio',
    'Editing',
    'Image',
  ],

  student: [
    'Education',
    'Research',
    'Documentation',
    'Productivity',
    'AI',
  ],

  'media-enthusiast': [
    'Media',
    'Video',
    'Audio',
    'Storage',
  ],
};

/**
 * Helper function to check if tool matches template
 * @param toolCategories - Array of categories from the tool
 * @param template - Selected template ID
 * @returns true if tool should be highlighted
 */
export const toolMatchesTemplate = (
  toolCategories: string[],
  template: string
): boolean => {
  if (template === 'all') return false; // Don't highlight "All"

  const templateCategories = templateMappings[template] || [];
  return toolCategories.some(cat => templateCategories.includes(cat));
};
