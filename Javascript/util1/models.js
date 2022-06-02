export class User {
  constructor(firstName, lastName, email) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
  }
}

export class Memory {
  constructor(title, description, image, tags) {
    this.title = title;
    this.description = description;
    this.image = image;
    this.tags = tags;
    this.date = new Date().valueOf();
  }
}