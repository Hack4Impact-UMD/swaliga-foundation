"use client";
import { useEffect, useRef, useState } from "react";
import os from "os";
import { User } from "@/types/user-types";
import { getUserList } from "@/lib/firebase/database/users";
import { Timestamp } from "firebase/firestore";

const users2csv = (users: User[]): string => {
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
              ?.map((g) => `${g.firstName} ${g.lastName}`)
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
  return csv.join(os.EOL);
};

const Home = () => {
  const [download, setDownload] = useState("");
  const downloadLink = useRef<HTMLAnchorElement>(null);

  const downloadUserList = async () => {
    try {
      const users = await getUserList();
      setDownload(users2csv(users));
    } catch (error) {
      console.error("Error downloading user list:", error);
    }
  };

  useEffect(() => {
    if (download.length > 0) {
      downloadLink.current?.click();
      setDownload("");
    }
  }, [download]);

  return (
    <>
      <div>
        <button
          style={{
            width: "160px",
            height: "40px",
            margin: "10px",
          }}
          className="downloadButton"
          onClick={downloadUserList}
        >
          Download Users
        </button>
        <a
          href={`data:text/csv;charset=utf-8,${encodeURIComponent(download)}`}
          download="students.csv"
          hidden={true}
          ref={downloadLink}
        ></a>
      </div>
    </>
  );
};

export default Home;
