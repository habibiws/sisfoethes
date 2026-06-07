export const FEATURES = {
  PRINT_REPORT: 'print_report',
  EMAIL_REMINDER: 'email_reminder',
  EXPORT_EXCEL: 'export_excel',
  DARK_MODE: 'dark_mode'
};

export const getFeatureFlag = (flagName, defaultValue = false) => {
  const value = localStorage.getItem(`ff_${flagName}`);
  if (value === null) {
    // Set default value in localStorage if not set yet
    localStorage.setItem(`ff_${flagName}`, defaultValue ? 'true' : 'false');
    return defaultValue;
  }
  return value === 'true';
};

export const setFeatureFlag = (flagName, value) => {
  localStorage.setItem(`ff_${flagName}`, value ? 'true' : 'false');
};
