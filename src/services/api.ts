import axios, { AxiosInstance } from "axios";
import { GO1_API_V3_URL } from "~/utils/urls";

class ApiV3Service {
  private http: AxiosInstance;

  constructor(jwt: string) {
    this.http = axios.create({
      baseURL: GO1_API_V3_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`,
        "api-version": "alpha",
      },
    });
  }

  async getEnrolments(): Promise<any> {
    return this.http.get("/enrollments?limit=5").then(({ data }) => {
      const loIds = data.hits
        .map((enrolment: any) => enrolment.lo_id)
        .join("&id[]=");
      return this.http
        .get(`/learning-objects?id[]=${loIds}`)
        .then(({ data }) => {
          return data;
        });
    });
  }

  async getAssignedLearning(accountId: string): Promise<any> {
    const enrolments = await this.http
      .get(`/enrollments?enrollment_type=assigned&user_account_id=${accountId}`)
      .then(({ data }) => data.hits);

    const loIds = enrolments
      .map((enrolment: any) => enrolment.lo_id)
      .join("&id[]=");
    const los = await this.http
      .get(`/learning-objects?id[]=${loIds}`)
      .then(({ data }) => data.hits);

    return enrolments.map((enrolment: any) => {
      const lo = los.find((lo: any) => lo.id === enrolment.lo_id);
      return {
        ...enrolment,
        lo: {
          id: lo?.id || 0,
          title: lo?.core?.title || enrolment.lo_id,
          image: lo?.core.image || "",
          description: lo?.core.description || "",
        },
      };
    });
  }
}

export default ApiV3Service;
