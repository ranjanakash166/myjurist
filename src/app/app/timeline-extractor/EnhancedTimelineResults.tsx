import React, { useState } from "react";
import { Download, FileText, Calendar, Filter, Search, ArrowUpDown, ArrowUp, ArrowDown, ExternalLink, BarChart3, Lightbulb, Clock, Target, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { EnhancedTimelineResponse, EnhancedTimelineEvent } from "../../../lib/timelineApi";
import { formatDateSafely, getNormalizedDate } from "../../../lib/utils";

interface EnhancedTimelineResultsProps {
  timeline: EnhancedTimelineResponse;
  onDownload: () => void;
  onExportCSV: () => void;
}

type SortField = 'date' | 'event_title' | 'event_type' | 'confidence_score';
type SortDirection = 'asc' | 'desc';

export default function EnhancedTimelineResults({ timeline, onDownload, onExportCSV }: EnhancedTimelineResultsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [expandedEvents, setExpandedEvents] = useState<Set<number>>(new Set());

  // Get unique event types for filter (filter out empty strings)
  const eventTypes = Array.from(new Set(timeline.events.map(event => event.event_type)))
    .filter(type => type && type.trim() !== '')
    .sort();

  // Filter and sort events
  const filteredAndSortedEvents = timeline.events
    .filter(event => {
      const matchesSearch = 
        event.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.event_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.document_source.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.raw_text.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesEventType = eventTypeFilter === "all" || event.event_type === eventTypeFilter;
      
      return matchesSearch && matchesEventType;
    })
    .sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];
      
      if (sortField === 'date') {
        const normalizedA = getNormalizedDate(aValue);
        const normalizedB = getNormalizedDate(bValue);
        
        // Handle invalid dates by placing them at the end
        if (!normalizedA && !normalizedB) {
          aValue = 0;
          bValue = 0;
        } else if (!normalizedA) {
          aValue = 1;
          bValue = 0;
        } else if (!normalizedB) {
          aValue = 0;
          bValue = 1;
        } else {
          aValue = new Date(normalizedA).getTime();
          bValue = new Date(normalizedB).getTime();
        }
      } else if (sortField === 'confidence_score') {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        aValue = String(aValue).toLowerCase();
        bValue = String(bValue).toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const toggleEventExpansion = (index: number) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedEvents(newExpanded);
  };

  const getEventTypeColor = (eventType: string) => {
    const colors: { [key: string]: string } = {
      'filing': 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      'hearing': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      'judgment': 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      'amendment': 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      'order': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      'motion': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
    };
    return colors[eventType.toLowerCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'text-green-600 dark:text-green-400';
    if (score >= 0.6) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getConfidenceLabelColor = (label: string) => {
    switch (label.toLowerCase()) {
      case 'high':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'low':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Section */}
      {timeline.summary && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Timeline Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2">Short Summary</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {timeline.summary.short}
                </p>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold text-sm mb-2">Legal Matter</h4>
                <p className="text-sm text-muted-foreground">
                  {timeline.summary.legal_matter}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="w-5 h-5" />
                Key Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeline.summary.key_insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground">{insight}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">Total Events</span>
            </div>
            <p className="text-2xl font-bold mt-1">{timeline.metadata.total_events}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-500" />
              <span className="text-sm font-medium">Documents</span>
            </div>
            <p className="text-2xl font-bold mt-1">{timeline.metadata.document_sources.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-500" />
              <span className="text-sm font-medium">Avg Confidence</span>
            </div>
            <p className="text-2xl font-bold mt-1">{(timeline.statistics.average_confidence * 100).toFixed(0)}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium">Duration</span>
            </div>
            <p className="text-2xl font-bold mt-1">{timeline.statistics.timeline_duration_days} days</p>
          </CardContent>
        </Card>
      </div>

      {/* Event Type Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Event Type Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(timeline.statistics.event_type_distribution).map(([type, count]) => (
              <div key={type} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">{type}</span>
                  <span className="text-sm text-muted-foreground">{count}</span>
                </div>
                <Progress 
                  value={(count / timeline.metadata.total_events) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Event Type Filter */}
          {eventTypes.length > 0 && (
            <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Event Types</SelectItem>
                {eventTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Export Buttons */}
        <div className="flex gap-2">
          <Button variant="outline" onClick={onExportCSV} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
          <Button onClick={onDownload} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download JSON
          </Button>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedEvents.length} of {timeline.metadata.total_events} events
      </div>

      {/* Timeline Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('date')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Date
                      {sortField === 'date' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="ml-1 w-4 h-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('event_title')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Event Title
                      {sortField === 'event_title' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="ml-1 w-4 h-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Document Source</TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('event_type')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Event Type
                      {sortField === 'event_type' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="ml-1 w-4 h-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      onClick={() => handleSort('confidence_score')}
                      className="h-auto p-0 font-semibold hover:bg-transparent"
                    >
                      Confidence
                      {sortField === 'confidence_score' ? (
                        sortDirection === 'asc' ? <ArrowUp className="ml-1 w-4 h-4" /> : <ArrowDown className="ml-1 w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="ml-1 w-4 h-4" />
                      )}
                    </Button>
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedEvents.map((event, index) => (
                  <React.Fragment key={event.id}>
                    <TableRow>
                      <TableCell className="font-medium">
                        <div className="space-y-1">
                          <div>{event.formatted_date || formatDateSafely(event.date)}</div>
                          <div className="text-xs text-muted-foreground">{formatDateSafely(event.date, 'Raw: ' + event.date)}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px]">
                        <div className="truncate" title={event.event_title}>
                          {event.event_title}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <div className="truncate" title={event.event_description}>
                          {event.event_description}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[150px]">
                        <div className="truncate" title={event.document_source}>
                          {event.document_source}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge className={getEventTypeColor(event.event_type)}>
                            {event.event_type}
                          </Badge>
                          <div className="text-xs text-muted-foreground">
                            {event.event_type_label}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <span className={`font-medium ${getConfidenceColor(event.confidence_score)}`}>
                            {(event.confidence_score * 100).toFixed(0)}%
                          </span>
                          <Badge className={getConfidenceLabelColor(event.confidence_label)}>
                            {event.confidence_label}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleEventExpansion(index)}
                          className="h-8 w-8 p-0"
                        >
                          {expandedEvents.has(index) ? '−' : '+'}
                        </Button>
                      </TableCell>
                    </TableRow>
                    {expandedEvents.has(index) && (
                      <TableRow>
                        <TableCell colSpan={7} className="bg-muted/30">
                          <div className="p-4 space-y-3">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Full Description</h4>
                              <p className="text-sm text-muted-foreground">{event.event_description}</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Paragraph Reference</h4>
                              <p className="text-sm text-muted-foreground">{event.paragraph_reference}</p>
                            </div>
                            <Separator />
                            <div>
                              <h4 className="font-semibold text-sm mb-2">Raw Text</h4>
                              <p className="text-sm text-muted-foreground bg-background p-3 rounded border">
                                {event.raw_text}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredAndSortedEvents.length === 0 && (
        <Card className="flex items-center justify-center py-12">
          <CardContent className="text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No Events Found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search terms or filters to see more results.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 