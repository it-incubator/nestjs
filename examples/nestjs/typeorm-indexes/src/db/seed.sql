DO $$
DECLARE
i INT := 1;
BEGIN
    WHILE i <= 1000000 LOOP
        INSERT INTO public."user" ("firstName", "lastName", email, balance, login, dob)
        VALUES (
            'User' || i,
            'Surname' || i,
            'user' || i || '@example.com',
            (random() * 10000)::int,
            'login' || i,
            TIMESTAMP '1970-01-01' + (random() * (EXTRACT(EPOCH FROM CURRENT_TIMESTAMP - TIMESTAMP '1970-01-01')) || ' seconds')::interval
        );

        i := i + 1;
END LOOP;
END $$;
