import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Check, X, AlertTriangle, FileText, BarChart3, BadgeCheck, Layers, Info, Database, ArrowUpDown, Shield } from "lucide-react";
import { analyzeModel, AnalysisResult, CategoryResult, RuleCategory } from "@/services/BestPracticesAnalyzer";
import { ProcessedData } from "@/services/VpaxProcessor";
import { Checkbox } from "@/components/ui/checkbox";
interface BestPracticesAnalyzerProps {
  data: ProcessedData;
}
const BestPracticesAnalyzer: React.FC<BestPracticesAnalyzerProps> = ({
  data
}) => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<RuleCategory | 'overview'>('overview');
  const [expandedRules, setExpandedRules] = useState<Set<string>>(new Set());
  const runAnalysis = () => {
    const result = analyzeModel(data);
    setAnalysisResult(result);
  };
  const toggleRuleExpansion = (ruleId: string) => {
    const newExpandedRules = new Set(expandedRules);
    if (newExpandedRules.has(ruleId)) {
      newExpandedRules.delete(ruleId);
    } else {
      newExpandedRules.add(ruleId);
    }
    setExpandedRules(newExpandedRules);
  };
  const getCategoryIcon = (category: RuleCategory) => {
    switch (category) {
      case 'maintenance':
        return <Layers className="h-4 w-4" />;
      case 'dax':
        return <FileText className="h-4 w-4" />;
      case 'naming':
        return <BadgeCheck className="h-4 w-4" />;
      case 'modeling':
        return <Database className="h-4 w-4" />;
      case 'formatting':
        return <ArrowUpDown className="h-4 w-4" />;
      case 'report':
        return <BarChart3 className="h-4 w-4" />;
      case 'performance':
        return <BarChart3 className="h-4 w-4" />;
      case 'error-prevention':
        return <Shield className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };
  if (!analysisResult) {
    return <div className="space-y-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-medium">Best Practices Analyzer</h3>
              <p className="text-muted-foreground">
                Analyze your model against industry best practices to improve performance and maintainability.
              </p>
              <Button onClick={runAnalysis} className="mt-4">
                Run Analysis
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>;
  }
  const categoryCards = analysisResult.categories.map(category => <Card key={category.category} className="relative overflow-hidden">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            {category.failedRules > 0 ? <AlertTriangle className="h-5 w-5 text-amber-500" /> : <Check className="h-5 w-5 text-green-500" />}
            <h3 className="text-lg font-medium">{category.displayName}</h3>
          </div>
          
          <div className="text-sm text-muted-foreground">
            {category.totalRules} Rules
          </div>
          
          <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{
            width: `${category.passedRules / category.totalRules * 100}%`
          }} />
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-destructive">{category.failedRules} FAILED</div>
            <div className="text-green-500">{category.passedRules} PASSED</div>
          </div>
        </div>
      </CardContent>
    </Card>);
  const renderOverview = () => <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categoryCards}
      </div>
    </div>;
  const renderCategoryDetails = (category: CategoryResult) => <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        {category.rules.map(rule => {
        const result = category.results[rule.id];
        const isExpanded = expandedRules.has(rule.id);
        return <Collapsible key={rule.id} open={isExpanded} className="border rounded-md overflow-hidden">
              <CollapsibleTrigger onClick={() => toggleRuleExpansion(rule.id)} className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted/50 transition-colors text-left">
                <div className="flex items-center space-x-3">
                  {result.passed ? <Check className="h-5 w-5 text-green-500 flex-shrink-0" /> : <X className="h-5 w-5 text-destructive flex-shrink-0" />}
                  <div>
                    <div className="font-medium">
                      {rule.name} {result.affectedObjects && result.affectedObjects.length > 0 && <span className="text-muted-foreground text-sm">
                          ({result.affectedObjects.length} {result.affectedObjects.length === 1 ? 'object' : 'objects'})
                        </span>}
                    </div>
                    <div className="text-sm text-muted-foreground">{rule.description}</div>
                  </div>
                </div>
                <div className="ml-2">
                  <div className={`px-2 py-1 text-xs rounded-full ${result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.passed ? 'PASSED' : 'FAILED'}
                  </div>
                </div>
              </CollapsibleTrigger>
              
              {result.affectedObjects && result.affectedObjects.length > 0 && <CollapsibleContent className="px-4 py-3 border-t bg-muted/30">
                  <div className="space-y-2">
                    <div className="font-medium text-sm">Affected Objects:</div>
                    <div className="max-h-48 overflow-y-auto">
                      <ul className="space-y-1 text-sm">
                        {result.affectedObjects.map((obj, i) => <li key={i} className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                            <span>{obj}</span>
                          </li>)}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>}
            </Collapsible>;
      })}
      </div>
    </div>;
  return <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Best Practices</h2>
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm font-medium">
            <span className="text-muted-foreground">Total:</span>
            <div className="flex items-center space-x-1">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span>{analysisResult.totalRules} Rules</span>
            </div>
            <div className="flex items-center space-x-1">
              <X className="h-4 w-4 text-destructive" />
              <span>{analysisResult.failedRules} Failed</span>
            </div>
            <div className="flex items-center space-x-1">
              <Check className="h-4 w-4 text-green-500" />
              <span>{analysisResult.passedRules} Passed</span>
            </div>
          </div>
        </div>
      </div>
      
      <Tabs defaultValue="overview" onValueChange={value => setSelectedCategory(value as RuleCategory | 'overview')} className="space-y-4">
        <div className="flex overflow-x-auto pb-2 no-scrollbar">
          <TabsList className="bg-transparent h-auto p-0 space-x-2">
            <TabsTrigger value="overview" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 flex items-center">
              <Info className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            
            {analysisResult.categories.map(category => <TabsTrigger key={category.category} value={category.category} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground h-9 flex items-center">
                {getCategoryIcon(category.category)}
                <span className="ml-2">{category.displayName}</span>
                <span className="ml-2 text-xs bg-muted rounded-full px-2 py-1 text-gray-600">
                  {category.passedRules}/{category.totalRules}
                </span>
              </TabsTrigger>)}
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="mt-6">
          {renderOverview()}
        </TabsContent>
        
        {analysisResult.categories.map(category => <TabsContent key={category.category} value={category.category} className="mt-6">
            {renderCategoryDetails(category)}
          </TabsContent>)}
      </Tabs>
      
      <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="h-5 w-5 text-primary" />
          <h3 className="font-medium">🧮 Scoring System</h3>
        </div>
        <div className="text-sm text-muted-foreground">
          <p>Each checked item scores 1 point. Your compliance score is calculated as:</p>
          <div className="mt-1 font-mono bg-muted/50 p-2 rounded">
            Score = (Rules Passed / Total Rules) × 100%
          </div>
          <div className="mt-2 font-medium">
            Your score: {Math.round(analysisResult.passedRules / analysisResult.totalRules * 100)}%
          </div>
        </div>
      </div>
    </div>;
};
export default BestPracticesAnalyzer;