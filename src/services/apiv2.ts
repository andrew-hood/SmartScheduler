import axios, { AxiosInstance } from "axios";
import { GO1_API_V2_URL } from "~/utils/urls";

class ApiV2Service {
  private http: AxiosInstance;

  constructor(jwt: string) {
    this.http = axios.create({
      baseURL: GO1_API_V2_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${jwt}`
      },
    });
  }

  async getAssignedLearning(accountId: string): Promise<any> {
    const enrolments = await this.http
      .get(`/enrollments?user_id=${accountId}&include=lo`)
      .then(({ data }) => data.hits);
    return enrolments.map((enrolment: any) => {
      return {...enrolment,
        lo: {
          id: enrolment?.lo?.id,
          title: enrolment?.lo?.title,
          image: enrolment?.lo?.image,
          description: enrolment?.lo?.summary,
          duration: enrolment?.lo?.delivery?.duration,
        }
      }
    });
  }
}

export default ApiV2Service;
