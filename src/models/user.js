class User {
  constructor(options) {
    const { id, email, about, birthDate, profileImg } = options;
    this.id = id;
    this.email = email;
    this.about = about;
    this.birthDate = birthDate;
    this.profileImg = profileImg;
  }
}

export default User;
