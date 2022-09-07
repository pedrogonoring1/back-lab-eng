export const userExistsError = new Error('User already exists');
userExistsError.name = 'UserExists';

export const dogExistsError = new Error('Dog already exists');
dogExistsError.name = 'DogExists';

export const adoptionExistsError = new Error('Adoption already exists');
adoptionExistsError.name = 'AdoptionExists';

export const userNotFoundError = new Error('User not found');
userNotFoundError.name = 'UserNotFound';

export const incorrectPasswordError = new Error('Incorrect Password');
incorrectPasswordError.name = 'IncorrectPassword';

export const userNotVerifiedError = new Error('User Not Verified Yet');
userNotVerifiedError.name = 'UserNotVerified';

export const sendingEmailError = new Error('Sending Email Error');
sendingEmailError.name = 'SendingEmail';

export const invalidCpfOrCnpjError = new Error('Invalid CPF or CNPJ');
invalidCpfOrCnpjError.name = 'InvalidCpfOrCnpj';

export const invalidEmailError = new Error('Invalid email');
invalidEmailError.name = 'InvalidEmail';