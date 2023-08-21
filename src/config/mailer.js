import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "camargoherrerajuanpablo02@gmail.com",
    pass: "qarmjxzcpohemkms",
  },
});

export default transporter;