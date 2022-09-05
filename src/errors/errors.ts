export const userExistsError = new Error('User already exists');
userExistsError.name = 'UserExists';

export const dogExistsError = new Error('Dog already exists');
dogExistsError.name = 'DogExists';

export const adoptionExistsError = new Error('Adoption already exists');
adoptionExistsError.name = 'AdoptionExists';

export const userNotFound = new Error('User not found');
userNotFound.name = 'UserNotFound';

export const incorrectPassword = new Error('Incorrect Password');
incorrectPassword.name = 'incorrectPassword';
userNotFound.name = 'UserNotFound';

export const userNotVerified = new Error('User Not Verified Yet');
userNotVerified.name = 'userNotVerified';

export const sendingEmailError = new Error('Sending Email Error');
sendingEmailError.name = 'sendingEmailError';
