
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Pin, Plus, X, Image } from "lucide-react";

interface LinkedNotesProps {
  page: number;
  highlightedText: string;
  onClearHighlight: () => void;
}

interface Note {
  id: string;
  page: number;
  highlight: string;
  content: string;
  timestamp: Date;
}

const LinkedNotes = ({ page, highlightedText, onClearHighlight }: LinkedNotesProps) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  
  // Filter notes by current page
  const pageNotes = notes.filter(note => note.page === page);
  
  const handleAddNote = () => {
    if (highlightedText || newNote) {
      const note: Note = {
        id: `note-${Date.now()}`,
        page,
        highlight: highlightedText,
        content: newNote,
        timestamp: new Date()
      };
      
      setNotes(prev => [note, ...prev]);
      setNewNote("");
      onClearHighlight();
    }
  };
  
  const handleDeleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardTitle className="text-md flex items-center gap-2">
          <Pin className="h-4 w-4" />
          Linked Notes for Page {page}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add new note section */}
        {highlightedText && (
          <div className="bg-yellow-50 border border-yellow-200 p-2 rounded-md text-sm">
            <div className="flex items-center justify-between">
              <div className="font-medium">Selected Text:</div>
              <Button variant="ghost" size="sm" onClick={onClearHighlight}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="mt-1 italic">"{highlightedText}"</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Textarea
            placeholder="Add a note about this page or highlighted text..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[80px] bg-white/80"
          />
          
          <div className="flex items-center justify-between">
            <Button variant="outline" size="sm">
              <Image className="h-4 w-4 mr-2" />
              Add Image
            </Button>
            
            <Button 
              onClick={handleAddNote}
              size="sm"
              disabled={!highlightedText && !newNote}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>
        
        {/* Notes list */}
        <div className="space-y-3 mt-4">
          {pageNotes.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">
              No notes for this page yet.
            </div>
          ) : (
            pageNotes.map((note) => (
              <div key={note.id} className="border rounded-md p-3 bg-white">
                {note.highlight && (
                  <div className="bg-yellow-50 p-2 rounded-md text-sm mb-2">
                    <div className="font-medium text-xs text-yellow-700">Highlighted Text:</div>
                    <p className="italic">"{note.highlight}"</p>
                  </div>
                )}
                
                <div className="text-sm">{note.content}</div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="text-xs text-gray-500">
                    {note.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDeleteNote(note.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedNotes;
