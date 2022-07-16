

export const validateName = new RegExp('^[a-zA-Z0-9 ]{2,20}$');
export const validatePassword = new RegExp('^(.){8,16}$');
export const emptyString = new RegExp('^\\s+$');