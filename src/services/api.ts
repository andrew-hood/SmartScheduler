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
}

export default ApiV3Service;
