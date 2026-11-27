// Hand-written, not generated: update it with every migration.
export interface Database {
  public: {
    Tables: {
      habits: {
        Row: {
          id: string;
          name: string;
          position: number;
          archived_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          position?: number;
          archived_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          position?: number;
          archived_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      habit_checkins: {
        Row: {
          habit_id: string;
          day: string;
          created_at: string;
        };
        Insert: {
          habit_id: string;
          day: string;
          created_at?: string;
        };
        Update: {
          habit_id?: string;
          day?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'habit_checkins_habit_id_fkey';
            columns: ['habit_id'];
            isOneToOne: false;
            referencedRelation: 'habits';
            referencedColumns: ['id'];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
