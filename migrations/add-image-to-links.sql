DO $$
    BEGIN
        BEGIN
          ALTER TABLE links ADD COLUMN "image" text;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column <column_name> already exists in <table_name>.';
        END;
    END;
$$
