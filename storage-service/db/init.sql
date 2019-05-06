CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" character varying NOT NULL, 
    "surname" character varying NOT NULL,
    "gender" character varying,
    "email" character varying NOT NULL, 
    "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
    "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), 
    CONSTRAINT "UQ_a3ffb1c0c8416b9fc6f907b7433" UNIQUE ("id"), 
    CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
);

CREATE TABLE "credentials" (
    "idUser" integer NOT NULL,
    "username" character varying NOT NULL, 
    "password" character varying NOT NULL, 
    "role" character varying NOT NULL, 
    "token" character varying, 
    CONSTRAINT "UQ_9696610f85145a37910365498f9" UNIQUE ("username"), 
    CONSTRAINT "REL_d298cc63c0211b220638dbceb8" UNIQUE ("idUser"), 
    CONSTRAINT "PK_d298cc63c0211b220638dbceb88" PRIMARY KEY ("idUser")
);

ALTER TABLE "credentials" ADD CONSTRAINT "FK_d298cc63c0211b220638dbceb88" 
    FOREIGN KEY ("idUser") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;


WITH rows AS (
   insert into users(name, surname, gender, email) values('admin', 'admin', 'M', 'admin@example.com')
    RETURNING id
)
INSERT INTO credentials ("idUser", username, password, role)
values((SELECT id FROM rows), 'admin', '$2a$08$RfxlaF8/jT.Fxw8BYuXqfexN5VF9Mm7V.lFSrotzIwXRHKGcKpNji', 'A');

WITH rows AS (
   insert into users(name, surname, gender, email) values('user', 'user', 'M', 'user@example.com')
    RETURNING id
)
INSERT INTO credentials ("idUser", username, password, role)
values((SELECT id FROM rows), 'user', '$2a$08$skGl71AFJvTS0RyJAZ6rYuRBqLZWP6rE64O6DtAmadq.sLz897uNW', 'U');