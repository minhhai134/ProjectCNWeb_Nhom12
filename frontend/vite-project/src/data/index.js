import { faker } from "@faker-js/faker";
import {
  ChatCircleDots,
  Gear,
  GearSix,
  Phone,
  SignOut,
  User,
  Users,
} from "phosphor-react";

const Profile_Menu = [
  {
    title: "Profile",
    icon: <User />,
  },
  {
    title: "Sign Out",
    icon: <SignOut />,
  },
];

const Nav_Buttons = [
  {
    index: 0,
    icon: <ChatCircleDots />,
  },
];

const CallList = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: false,
    missed: true,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: true,
    missed: true,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: false,
    missed: false,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: false,
    missed: false,
  },
  {
    id: 6,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
  {
    id: 7,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: false,
    missed: false,
  },
  {
    id: 8,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
  {
    id: 9,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: false,
    missed: false,
  },
  {
    id: 10,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
  {
    id: 11,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: false,
    incoming: false,
    missed: false,
  },
  {
    id: 12,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    online: true,
    incoming: true,
    missed: false,
  },
];

const ChatList = [
  {
    id: 0,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "9:36",
    unread: 3,
    pinned: true,
    online: true,
  },
  {
    id: 1,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "12:02",
    unread: 2,
    pinned: true,
    online: false,
  },
  {
    id: 2,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "10:35",
    unread: 3,
    pinned: false,
    online: true,
  },
  {
    id: 3,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "04:00",
    unread: 0,
    pinned: false,
    online: true,
  },
  {
    id: 4,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 5,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 6,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
  {
    id: 7,
    img: faker.image.avatar(),
    name: faker.name.firstName(),
    msg: faker.music.songName(),
    time: "08:42",
    unread: 0,
    pinned: false,
    online: false,
  },
];

const Chat_History = [
  {
    type: "msg",
    message: "Chào buổi sáng 👋🏻, hôm nay của bạn thế nào",
    incoming: true,
    outgoing: false,
  },
  {
    type: "divider",
    text: "Today",
  },
  {
    type: "msg",
    message: "Hi 👋 bạn, tôi ổn, còn bạn ?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Bạn có thể gửi tôi một bức ảnh không?",
    incoming: false,
    outgoing: true,
  },
  {
    type: "msg",
    message: "Tất nhiên rồi, tôi đang gửi bạn đây",
    incoming: true,
    outgoing: false,
  },

  {
    type: "msg",
    subtype: "img",
    message: "Của bạn đây",
    img: faker.image.abstract(),
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    message: "Bạn có thể gửi dạng file đính kèm không?",
    incoming: false,
    outgoing: true,
  },

  {
    type: "msg",
    subtype: "doc",
    message: "Được chứ, của bạn đây.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.cats(),
    message: "Ồ tôi làm được nè",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "reply",
    reply: "Ồ tuyệt thật đấy",
    message: "Ồ tôi làm được nè",
    incoming: false,
    outgoing: true,
  },
];

const Message_options = [
  {
    title: "Reply",
  },
  {
    title: "React to message",
  },
  {
    title: "Forward message",
  },
  {
    title: "Star message",
  },
  {
    title: "Report",
  },
  {
    title: "Delete Message",
  },
];

const MembersList=[
  {
    id:0,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName(),
    online:true,
  },
  {
    id:1,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName(),
    online:true,
  },
  {
    id:2,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName(),
    online:true,
  },
  {
    id:3,
    img: faker.image.avatar(),
    name:faker.name.fullName(),
    firstName:faker.name.firstName(),
    lastName:faker.name.lastName(),
    online:false,
  },
]

const Shared_docs = [
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "doc",
    message: "Yes sure, here you go.",
    incoming: true,
    outgoing: false,
  },
];

const Shared_links = [
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.food(),
    message: "Ồ tôi làm được nè",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.food(),
    message: "Ồ tôi làm được nè",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.food(),
    message: "Ồ tôi làm được nè",
    incoming: true,
    outgoing: false,
  },
  {
    type: "msg",
    subtype: "link",
    preview: faker.image.food(),
    message: "Ồ tôi làm được nè",
    incoming: true,
    outgoing: false,
  },
];

export {
  Profile_Menu,
  Nav_Buttons,
  ChatList,
  Chat_History,
  Message_options,
  Shared_links,
  Shared_docs,
  CallList,
  MembersList,
};
