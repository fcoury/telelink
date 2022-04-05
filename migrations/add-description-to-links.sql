DO $$
    BEGIN
        BEGIN
          ALTER TABLE links ADD COLUMN "description" text;
        EXCEPTION
            WHEN duplicate_column THEN RAISE NOTICE 'column description already exists in links.';
        END;
    END;
$$
