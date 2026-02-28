'use client';

import useProfile from "./useProfile";

export default function IncompleteProfileMessage() {
  const { student } = useProfile();

  if (!student) {
    return <></>;
  }

  const isProfileIncomplete =
    !student.joinedSwaligaDate ||
    !student.address ||
    !student.address.addressLine1 ||
    !student.address.city ||
    !student.address.state ||
    !student.address.country ||
    !student.address.zipCode ||
    !student.school.gradYear ||
    !student.school.gpa ||
    !student.school.address ||
    !student.school.address.addressLine1 ||
    !student.school.address.city ||
    !student.school.address.state ||
    !student.school.address.country ||
    !student.school.address.zipCode ||
    student.guardians.some((guardian) => !guardian.email || !guardian.phone);

  if (!isProfileIncomplete) {
    return <></>;
  }

  return <p>bruh</p>
}
