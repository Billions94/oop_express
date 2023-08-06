import { GET, Path } from 'typescript-rest';
import { resError, resOK } from './index';

@Path('/api/health')
export class Health {
  /**
   * Getting basic health status and current API version information with a simple GET request
   * This is mainly used for automated CI/CD deployments and basic service health checks over
   * Google cloud platform services. It is going to respond with current service version
   * defined in package.json file
   */
  @GET
  check() {
    try {
      return resOK({
        uptime: process.uptime(),
        message: 'OK',
        date: new Date(),
      });
    } catch (e) {
      return resError(e.message);
    }
  }
}
