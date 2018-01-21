package oracle.apiplatform.policies.%%policyname%%;

import org.json.JSONObject;

import oracle.apiplatform.policies.%%policyname%%.%%POLICYNAME%%Constants;
import oracle.apiplatform.policies.sdk.context.ApiRuntimeContext;
import oracle.apiplatform.policies.sdk.exceptions.PolicyProcessingException;
import oracle.apiplatform.policies.sdk.runtime.PolicyRuntime;
import oracle.apiplatform.policies.sdk.runtime.PolicyRuntimeInitContext;

public class %%POLICYNAME%%Runtime implements PolicyRuntime, %%POLICYNAME%%Constants {

	public %%POLICYNAME%%Runtime(PolicyRuntimeInitContext initContext, JSONObject policyConfig) {
		
	}

	@Override
	public boolean execute(ApiRuntimeContext apiRuntimeContext) throws PolicyProcessingException {
		return true;
	}
}