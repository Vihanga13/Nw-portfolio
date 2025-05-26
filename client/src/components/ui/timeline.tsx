import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
  id: number;
  degree: string;
  institution: string;
  period: string;
  description: string;
  status: string;
  achievement?: string;
}

interface TimelineProps {
  items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-border"></div>
      
      <div className="space-y-12">
        {items.map((item, index) => (
          <div key={item.id} className="relative flex items-center">
            {/* Timeline dot */}
            <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 rounded-full border-4 border-background z-10 ${
              item.status === 'current' ? 'bg-primary' : 'bg-primary/60'
            }`}></div>
            
            {/* Content */}
            <div className={`ml-12 md:ml-0 ${
              index % 2 === 0 
                ? 'md:w-1/2 md:pr-8 md:text-right' 
                : 'md:w-1/2 md:ml-auto md:pl-8 md:text-left'
            }`}>
              <Card className="glass-card border-primary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-mono text-xs">
                      {item.period}
                    </Badge>
                    {item.status === 'current' && (
                      <Badge variant="default" className="bg-secondary text-secondary-foreground text-xs">
                        Current
                      </Badge>
                    )}
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2 text-foreground">
                    {item.degree}
                  </h3>
                  
                  <p className="text-muted-foreground mb-2 font-medium">
                    {item.institution}
                  </p>
                  
                  {item.achievement && (
                    <div className="flex items-center mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {item.achievement}
                      </Badge>
                    </div>
                  )}
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
