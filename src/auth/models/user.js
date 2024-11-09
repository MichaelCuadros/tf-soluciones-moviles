export default class UserModel {
    constructor({ usuario, password, nombres, apellidos, email, telefono, rol = 1 }) {
      this.usuario = usuario;
      this.password = password;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.email = email;
      this.telefono = telefono;
      this.rol = rol;
    }
  
    toJSON() {
      return {
        usuario: this.usuario,
        password: this.password,
        nombres: this.nombres,
        apellidos: this.apellidos,
        email: this.email,
        telefono: this.telefono,
        rol: this.rol,
      };
    }
  }