CREATE TABLE waiter_names (
    id SERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE week_days (
	id SERIAL PRIMARY KEY NOT NULL,
	days VARCHAR(50) NOT NULL
);

CREATE TABLE waiter_shifts (
	id SERIAL NOT NULL PRIMARY KEY,
    waiter_id INT NOT NULL,
	day_id INT NOT NULL,
	FOREIGN KEY (waiter_id) REFERENCES waiter_names(id),
    FOREIGN KEY (day_id) REFERENCES week_days(id)
);

INSERT INTO week_days (days) VALUES ('Sunday');
INSERT INTO week_days (days) VALUES ('Monday'); 
INSERT INTO week_days (days) VALUES ('Tuesday');
INSERT INTO week_days (days) VALUES ('Wednesday');
INSERT INTO week_days (days) VALUES ('Thursday'); 
INSERT INTO week_days (days) VALUES ('Friday');
INSERT INTO week_days (days) VALUES ('Saturday');
