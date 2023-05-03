import $ from "jquery";

interface IResult {
  status: "successed" | "rejected";
  response: XMLHttpRequest["response"];
  error: string | null;
  anyOptionalOption: any; //пример расширения, без внесения изменений в существующий код
}

class UserService {
  public _username: string;
  private _password: string;

  constructor(username: string, password: string) {
    if (
      username.length >= 1 &&
      password.length >= 1 &&
      username.length <= 20 &&
      password.length <= 20
    ) {
      this._username = username;
      this._password = password;
    } else {
      throw new Error("username or password cannot be empty");
    }
  }

  get username(): string {
    return this._username;
  }

  get password(): string {
    throw "You are not allowed to get password";
  }

  authenticate_user(cb: Function) {
    const body = {
      username: this.username,
      password: this._password,
    };

    const result: IResult = {
      status: "rejected",
      response: {},
      error: null,
      anyOptionalOption: undefined, //пример расширения, без внесения изменений в написанный код
    };

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://examples.com/api/user/authenticate", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.responseType = "json";
    xhr.onload = () => {
      if (xhr.status === 200) {
        result.status = "successed";
        result.response = xhr.response;
        result.anyOptionalOption = "Расширено"; //пример расширения, без внесения изменений в код
      } else {
        result.status = "rejected";
        result.response = xhr.response;
        result.error = xhr.response.error;
        result.anyOptionalOption = "Расширено, но с ошибкой в запросе"; //пример расширения, без внесения изменений в код
      }
      cb({ ...result });
    };

    xhr.send(JSON.stringify(body));
  }
}

$("form#login").on("submit", () => {
  const username = $("#username").val();
  const password = $("#password").val();

  new UserService(String(username), String(password)).authenticate_user(
    ({ status, response, error, anyOptionalOption }: IResult): void => {
      if (status === "successed") {
        document.cookie = `token=${response.token}`; //допустим у нас jwt
        document.location.href = "/home";
      } else {
        alert(error);
      }

      if (anyOptionalOption === "Расширено") {
        console.log("расширено");
      } else {
        console.log("расширено с ошибкой или редиректом");
      }
    }
  );
});
