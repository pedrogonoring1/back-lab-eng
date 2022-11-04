export const userExistsError = new Error('Usuário já existe');
userExistsError.name = 'UserExists';

export const dogExistsError = new Error('Cachorro já existe');
dogExistsError.name = 'DogExists';

export const adoptionExistsError = new Error('Adoção já existe');
adoptionExistsError.name = 'AdoptionExists';

export const dogNotFoundError = new Error('Cachorro não foi encontrado');
dogNotFoundError.name = 'DogNotFound';

export const userNotFoundError = new Error('Usuário não foi encontrado');
userNotFoundError.name = 'UserNotFound';

export const addressNotFoundError = new Error('Endereço não foi encontrado');
addressNotFoundError.name = 'AddressNotFound';

export const adoptionNotFoundError = new Error('Adoção não foi encontrada');
adoptionNotFoundError.name = 'AdoptionNotFound';

export const incorrectPasswordError = new Error('Senha incorreta');
incorrectPasswordError.name = 'IncorrectPassword';

export const userNotVerifiedError = new Error('Usuário não foi verificado');
userNotVerifiedError.name = 'UserNotVerified';

export const sendingEmailError = new Error('Erro ao enviar email');
sendingEmailError.name = 'SendingEmail';

export const invalidCpfOrCnpjError = new Error('CPF ou CNPJ inválido');
invalidCpfOrCnpjError.name = 'InvalidCpfOrCnpj';

export const invalidEmailError = new Error('Email inválido');
invalidEmailError.name = 'InvalidEmail';
