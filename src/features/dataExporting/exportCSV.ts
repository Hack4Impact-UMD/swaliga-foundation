import { Survey } from "@/types/survey-types";
import { getFullAddress, getFullName, Student } from "@/types/user-types";

const EOL = '\r\n';

function getStudentSummaryRow(student: Student, maxNumGuardians: number): string[] {
  return [
    student.id,
    getFullName(student.name),
    student.email,
    student.phone || "N/A",
    student.gender,
    `"${student.ethnicity.join(', ')}"`,
    student.dateOfBirth,
    student.joinedSwaligaDate,
    `"${getFullAddress(student.address)}"`,
    student.school.name,
    `"${getFullAddress(student.school.address)}"`,
    student.school.gradYear.toString(),
    student.school.gpa.toString(),
    ...student.guardians.map(g => [
      getFullName(g.name),
      g.email,
      g.phone || "N/A",
      g.gender,
      g.relationship
    ]).flat()
  ]
}

export function exportStudentSummariesToCSV(students: Student[]) {
  students = students.sort((a, b) => a.id.localeCompare(b.id));
  const maxNumGuardians = Math.max(...students.map(s => s.guardians.length));
  const columnHeaders: string[] = [
    'ID',
    'Name',
    'Email',
    'Phone',
    'Gender',
    'Ethnicity',
    'Date of Birth',
    'Joined Swaliga Date',
    'Address',
    'School Name',
    'School Address',
    'Graduation Year',
    'GPA',
    ...Array.from({ length: maxNumGuardians }, (_, i) => [`Guardian ${i + 1} Name`, `Guardian ${i + 1} Email`, `Guardian ${i + 1} Phone`, `Guardian ${i + 1} Gender`, `Guardian ${i + 1} Relationship`]).flat()
  ]
  const cells: string[][] = [
    columnHeaders,
    ...students.map(student => getStudentSummaryRow(student, maxNumGuardians))
  ]
  createCSV(cells, "student_summaries");
}

export function exportSurveyToCSV(survey: Survey) {

}

export function createCSV(cells: string[][], filename: string) {
  const csvContent = "data:text/csv;charset=utf-8," + cells.join(EOL);
  const encodedUri = encodeURI(csvContent);
  var link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link)
}