export interface GetEmployeesResponse {
  employees: EmployeeInfoDTO[] | null;
}

export interface EmployeeInfoDTO {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
}
