import { grantAccess, setTokens, setUser } from "@lib";
import { coreApp } from "../../../mod.ts";
import { removeUserFn } from "./removeUser.fn.ts";
import { removeUserValidator } from "./removeUser.val.ts";

export const removeUserSetup = () =>
  coreApp.acts.setAct({
    schema: "user",
    actName: "removeUser",
    fn: removeUserFn,
    preAct: [
      setTokens,
      setUser,
      grantAccess({
        levels: ["Manager"],
      }),
    ],
    validator: removeUserValidator(),
  });
