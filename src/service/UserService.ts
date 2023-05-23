type UserData = {
  id: string;
  userName: string;
  roomName: string;
};

export default class UserService {
  // outer code can't access this variable
  private userMap: Map<string, UserData>;

  constructor() {
    // record user info
    this.userMap = new Map();
  }

  // add user info to userMap
  addUser(data: UserData) {
    this.userMap.set(data.id, data);
  }

  removeUser(id: string) {
    if (this.userMap.has(id)) {
      this.userMap.delete(id);
    }
  }

  getUser(id: string) {
    if (!this.userMap.has(id)) return null;

    const data = this.userMap.get(id);
    if (data) {
      return data;
    }
  }

  userDataInfoHandler(
    id: string,
    userName: string,
    roomName: string
  ): UserData {
    const data = {
      id,
      userName,
      roomName,
    };

    return data;
  }
}
