"use client";

import useProfile from "./useProfile";

export default function IncompleteProfileMessage() {
  const { student } = useProfile();

  if (!student) {
    return <></>;
  }

  const isProfileIncomplete =
    !student.joinedSwaligaDate ||
    !student.address ||
    !student.school.gradYear ||
    !student.school.gpa ||
    !student.school.address ||
    student.guardians.some((guardian) => !guardian.email || !guardian.phone);

  if (!isProfileIncomplete) {
    return <></>;
  }

  const missingFields: string[] = [];
  if (!student.joinedSwaligaDate) {
    missingFields.push("Joined Swaliga Date");
  }
  if (!student.address) {
    missingFields.push("Home Address");
  }
  if (!student.school.gradYear) {
    missingFields.push("Graduation Year");
  }
  if (!student.school.gpa) {
    missingFields.push("GPA");
  }
  if (!student.school.address) {
    missingFields.push("School Address");
  }
  if (!student.guardians.some((guardian) => !guardian.email)) {
    missingFields.push("at least 1 Guardian Email");
  }
  if (!student.guardians.some((guardian) => !guardian.phone)) {
    missingFields.push("at least 1 Guardian Phone Number");
  }

  return (
    <p>
      Please complete your profile when you are able to. You are currently
      missing the following fields: {missingFields.join(", ")}
    </p>
  );
}
