import { User } from "./User.js";

export class Staff extends User {
    constructor(id, name, phone, role) {
        super(id, name, phone);
        this.role = role;
    }

    displayInfo() {
        return `
        ${super.displayInfo()}
        Role: ${this.role}
        `;
    }
}