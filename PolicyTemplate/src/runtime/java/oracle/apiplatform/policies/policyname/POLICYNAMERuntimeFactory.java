package oracle.apiplatform.policies.%%policyname%%;

import org.json.JSONObject;

import oracle.apiplatform.policies.sdk.runtime.PolicyRuntime;
import oracle.apiplatform.policies.sdk.runtime.PolicyRuntimeFactory;
import oracle.apiplatform.policies.sdk.runtime.PolicyRuntimeInitContext;

public class %%POLICYNAME%%RuntimeFactory implements PolicyRuntimeFactory {
	
	@Override
	public PolicyRuntime getRuntime(PolicyRuntimeInitContext initContext,
			JSONObject policyConfig) throws Exception {
		
		return new %%POLICYNAME%%Runtime(initContext, policyConfig);

	}

}