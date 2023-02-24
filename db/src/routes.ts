import { UserController } from "./controller/UserController"
import {FriendListController} from "./controller/FriendListController";

export const Routes = [{
    method: "get",
    route: "/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: "/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:id",
    controller: UserController,
    action: "remove"
}, {
    method: "get",
    route: "/friendList",
    controller: FriendListController,
    action: "all"
}, {
    method: "get",
    route: "/friendList/:idOne/:idTwo",
    controller: FriendListController,
    action: "one"
}, {
    method: "post",
    route: "/users",
    controller: FriendListController,
    action: "save"
}, {
    method: "delete",
    route: "/users/:idOne/:idTwo",
    controller: FriendListController,
    action: "remove"
}]