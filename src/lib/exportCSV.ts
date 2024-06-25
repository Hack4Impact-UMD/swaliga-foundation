import { User } from "@/types/user-types";
import { Timestamp } from "firebase/firestore";
import os from 'os';

type flattenDoc = {
  [key: string]: any;
};

export function exportUsersToCSV(users: User[]): void {
  const fields: (keyof User)[] = [
    "firstName",
    "lastName",
    "middleName",
    "address",
    "school",
    "birthdate",
    "gradYear",
    "email",
    "phone",
    "yearsWithSwaliga",
    "ethnicity",
    "gender",
    "guardian",
    "password",
    "id",
    "assignedSurveys",
    "completedResponses",
  ];

  const csv: string[] = [];
  users.forEach((user) => {
    if (!user.isAdmin) {
      const values = fields.map((field) => {
        switch (field) {
          case "guardian":
            if (!user[field]) {
              return "N/A";
            }
            //only mapping guardian's first name and last name for now because if map individual properties of guardian, it will overwrite the student's properties that share the same field spelling
            //can try to map g again like we did with users
            return user.guardian
              ?.map((g) => `${g.name}`)
              .join("; ");
          case "birthdate":
            const timestamp = (user[field] as Timestamp | undefined)?.seconds;
            if (timestamp) {
              const date = new Date(timestamp * 1000);
              const bday = `${
                date.getMonth() + 1
              }/${date.getDate()}/${date.getFullYear()}`;
              return bday;
            } else {
              return "";
            }
          case "completedResponses":
          case "assignedSurveys":
            if (!user[field]) {
              return 0;
            }
            return user[field].join("; ");
          case "address":
            if (!user[field]) {
              return "N/A";
            }
            return `${user[field]}`.replaceAll(",", " ");
          default:
            return user[field];
        }
      });
      csv.push(values.join(","));
    }
  });

  csv.unshift(fields.join(","));

  const csvContent = "data:text/csv;charset=utf-8," + csv.join(os.EOL);
  const encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "my_data.csv");
  document.body.appendChild(link); // Required for FF
  link.click();
  document.body.removeChild(link)
};