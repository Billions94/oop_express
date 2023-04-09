import { GET, Path } from 'typescript-rest';
import { resOK } from './index';


@Path('/')
class Health {
  /**
   * Getting basic health status and current API version information with a simple GET request
   * This is mainly used for automated CI/CD deployments and basic service health checks over
   * Google cloud platform services. It is going to response with current service version
   * defined in package.json file
   */
  @GET
  index(): { status: string, version: string } {
    return resOK({
                   status: 'ok',
                   version: 'version',
                 });
  }
}