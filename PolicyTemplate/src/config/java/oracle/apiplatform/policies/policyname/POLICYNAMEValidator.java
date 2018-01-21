package oracle.apiplatform.policies.%%policyname%%;

import java.util.List;
import org.json.JSONObject;
import oracle.apiplatform.policies.sdk.validation.AbstractPolicyValidator;
import oracle.apiplatform.policies.sdk.validation.Diagnostic;
import oracle.apiplatform.policies.sdk.validation.Diagnostic.Severity;

public class %%POLICYNAME%%Validator extends AbstractPolicyValidator implements %%POLICYNAME%%Constants {
	
	@Override
	public void validateSyntax(JSONObject config, Context context) {
	}

	@Override
	public void validateSemantics(JSONObject policyConfig, Context context,
			List<Diagnostic> diagnostics) {
	}

}