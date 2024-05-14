INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (1, 'sos');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (2, 'ser');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (3, 'bazylia');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (4, 'salami');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (5, 'pieczarki');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (6, 'szynka');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (7, 'cebula');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (8, 'ananas');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (9, 'pomidor');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (10, 'brokuły');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (11, 'peperoni');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (12, 'papryka');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (13, 'kiełbasa');
INSERT INTO ingredients (ingredients.Id, ingredients.Name) VALUES (14, 'kurczak');

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (1, 'Margherita', 30);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (1, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (1, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (1, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (2, 'Salami', 32);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (2, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (2, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (2, 4);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (2, 5);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (2, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (3, 'Klasyczna', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 6);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 5);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (3, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (4, 'Hawajska', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (4, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (4, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (4, 6);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (4, 8);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (4, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (5, 'Europejska', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (5, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (5, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (5, 6);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (5, 9);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (5, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (6, 'Wegetariańska', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 5);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 10);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 9);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (6, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (7, 'Ostra', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 11);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 12);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (7, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (8, 'Swojska', 35);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 5);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 13);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 6);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (8, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (9, 'Kowbojska', 37);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 4);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 6);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 14);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 12);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (9, 3);

INSERT INTO pizzas (pizzas.id, pizzas.name, pizzas.price) VALUES (10, 'Meksykańska', 38);

INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 1);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 2);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 13);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 12);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 11);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 7);
INSERT INTO pizzas_ingredients (pizzas_ingredients.pizza_id, pizzas_ingredients.ingredient_id) VALUES (10, 3);
