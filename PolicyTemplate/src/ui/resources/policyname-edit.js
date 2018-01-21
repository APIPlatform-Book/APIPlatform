function PolicyConfigurationModel(ko, $, oj, config, additionalParams) {
	
    self = this;
    self.config = config;
    self.script = ko.observable("");
    self.l10n = ko.observable(additionalParams.l10nbundle);
    self.disableApplyPolicyButton = additionalParams.disableApplyPolicyButton;

    self.initialize = function() {
    	
        if (self.config) {
        	
            self.script(config.script);
            
        }
        
        self.disableApplyButton(false);
        
    };

    self.getPolicyConfiguration = function() {
    	
        var config = {"script" : ""};
        config.script  = self.script();;
        
        return config;
        
    };

    self.disableApplyButton = function(flag) {
    	
        self.disableApplyPolicyButton(flag);
        
    };

    self.initialize();
    
}