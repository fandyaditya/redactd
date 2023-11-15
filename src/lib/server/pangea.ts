import { PangeaConfig, RedactService } from "pangea-node-sdk";
import { PANGEA_REDACT_TOKEN, PANGEA_DOMAIN} from "$env/static/private";

const token = PANGEA_REDACT_TOKEN
const config = new PangeaConfig({ domain: PANGEA_DOMAIN });
const redact = new RedactService(token, config);

export default (async (input: string) : Promise<any> => {
  const response = await redact.redact(input, {
    return_result: true,
    debug: true
  });

  if (response.success) {
    return response.result
  } else {
    console.log("Error", response.code, response.result);
  }
});

//i can map from response.result.report.recognizer_results to response.result.redacted_text