
CREATE OR REPLACE FUNCTION purchases_update() RETURNS TRIGGER AS $set_purchases$
    DECLARE
    old_stock INTEGER;
    sum_price NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = NEW.itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchases
        SELECT sum(total_price) INTO sum_price FROM purchaseitems WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET total_price = sum_price WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION purchases_update();


    yg ini di
    
ERROR:  column "totalsum" does not exist
LINE 1: SELECT sum(totalsum)                FROM purchaseitems WHERE...
                   ^
QUERY:  SELECT sum(totalsum)                FROM purchaseitems WHERE invoice = NEW.invoice
CONTEXT:  PL/pgSQL function purchases_update() line 25 at SQL statement
SQL state: 42703
 ERROR:  column "total_price" does not exist
LINE 1: SELECT sum(total_price)                FROM purchaseitems WH...
                   ^
HINT:  Perhaps you meant to reference the column "purchaseitems.totalprice".
QUERY:  SELECT sum(total_price)                FROM purchaseitems WHERE invoice = NEW.invoice
CONTEXT:  PL/pgSQL function purchases_update() line 25 at SQL statement
SQL state: 42703

ERROR:  column purchaseitems.total_price does not exist
LINE 1: SELECT sum(purchaseitems.total_price)                FROM pu...
                   ^
HINT:  Perhaps you meant to reference the column "purchaseitems.totalprice".
QUERY:  SELECT sum(purchaseitems.total_price)                FROM purchaseitems WHERE invoice = NEW.invoice
CONTEXT:  PL/pgSQL function purchases_update() line 25 at SQL statement
SQL state: 42703

ERROR:  stack depth limit exceeded
HINT:  Increase the configuration parameter "max_stack_depth" (currently 2048kB), after ensuring the platform's stack depth limit is adequate.
CONTEXT:  SQL statement "SELECT 1 FROM ONLY "public"."units" x WHERE "unit"::pg_catalog.text OPERATOR(pg_catalog.=) $1::pg_catalog.text FOR KEY SHARE OF x"
SQL statement "UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode"
PL/pgSQL function purchases_update() line 16 at SQL statement
SQL statement "UPDATE purchaseitems SET totalprice = sum_price WHERE invoice = NEW.invoice"
PL/pgSQL function purchases_update() line 26 at SQL statement
SQL statement "UPDATE purchaseitems SET totalprice = sum_price WHERE invoice = NEW.invoice"
PL/pgSQL function purchases_update() line 26 at SQL statement






CREATE OR REPLACE FUNCTION purchases_updates() RETURNS TRIGGER AS $set_purchases$
    DECLARE
    old_stock INTEGER;
    sum_price NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = NEW.itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchases
        SELECT sum(totalprice) INTO sum_price FROM purchaseitems WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET totalprice = sum_price WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION purchases_updates();
ERROR:  stack depth limit exceeded
HINT:  Increase the configuration parameter "max_stack_depth" (currently 2048kB), after ensuring the platform's stack depth limit is adequate.
CONTEXT:  SQL statement "SELECT 1 FROM ONLY "public"."units" x WHERE "unit"::pg_catalog.text OPERATOR(pg_catalog.=) $1::pg_catalog.text FOR KEY SHARE OF x"
SQL statement "UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode"
PL/pgSQL function purchases_update() line 16 at SQL statement
SQL statement "UPDATE purchaseitems SET totalprice = sum_price WHERE invoice = NEW.invoice"
PL/pgSQL function purchases_update() line 26 at SQL statement
SQL statement "UPDATE purchaseitems SET totalprice = sum_price WHERE invoice = NEW.invoice"
PL/pgSQL function purchases_update() line 26 at SQL statement
================================================


==================================
CREATE OR REPLACE FUNCTION purchases_updates() RETURNS TRIGGER AS $set_purchases$
    DECLARE
   old_stock INTEGER;
    sum_price NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock =old_stock - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'UPDATE') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.barcitemcodeode;
            UPDATE goods SET stock =old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;
            
        ELSIF (TG_OP = 'DELETE') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock =old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        -- update penjualan
        SELECT sum(totalprice) INTO sum_price FROM purchaseitems WHERE invoice = NEW.invoice;
        UPDATE purchases SET totalsum = sum_price WHERE invoice = NEW.invoice;

        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION purchases_updates();










-----------------------------------------------------------remake-----------

CREATE OR REPLACE FUNCTION purchases_update() RETURNS TRIGGER AS $set_purchaseitems$
    DECLARE
    old_stock INTEGER;
    totalsum NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchaseitems
        SELECT sum(purchaseprice) INTO totalsum FROM purchase WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET purchaseprice = totalsum WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchaseitems$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchaseitems
AFTER INSERT OR UPDATE OR DELETE ON purchase
    FOR EACH ROW EXECUTE FUNCTION purchases_update();

--------------------------------------------------------------------
---------------------------------------------------------------------- 
   CREATE OR REPLACE FUNCTION purchaseitems_update() RETURNS TRIGGER AS $set_purchaseitems$
    DECLARE
    old_stock INTEGER;
    sum_prices NUMERIC;

    BEGIN

        IF (TG_OP = 'INSERT') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = itemcode;
           
        ELSIF (TG_OP = 'UPDATE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = itemcode;

        ELSIF (TG_OP = 'DELETE') THEN
            --update stock
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        --update purchaseitems
        SELECT sum(purchaseprice) INTO totalsum FROM purchases WHERE invoice = NEW.invoice;
        UPDATE purchaseitems SET purchaseprice = totalsum WHERE invoice = NEW.invoice;

        RETURN NULl; -- result is ignored this is an AFTER trigger

    END;
$set_purchaseitems$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchaseitems
AFTER INSERT OR UPDATE OR DELETE ON purchases
    FOR EACH ROW EXECUTE FUNCTION purchases_update(); 


    error keterangan
    ERROR:  "totalsum" is not a known variable
LINE 25:         SELECT sum(purchaseprice) INTO totalsum FROM purchas...
    ---------------------------------------------------------------
  





--update totalprice

CREATE OR REPLACE FUNCTION price_update() RETURNS TRIGGER AS $set_total_price$
    DECLARE
        purchaseprice_goods NUMERIC;
    BEGIN 
        SELECT purchaseprice INTO purchaseprice_goods FROM goods WHERE barcode = NEW.itemcode;
        NEW.purchaseprice := purchaseprice_goods;
        NEW.totalprice := NEW.quantity * purchaseprice_goods;
        RETURN NEW;
   
    END;
$set_total_price$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_price
BEFORE INSERT OR UPDATE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION price_update();

ERROR:  column "totalsum" does not exist
LINE 1: SELECT sum(totalsum)                FROM purchaseitems WHERE...
                   ^
QUERY:  SELECT sum(totalsum)                FROM purchaseitems WHERE invoice = NEW.invoice
CONTEXT:  PL/pgSQL function purchases_update() line 25 at SQL statement
SQL state: 42703
 

















====================================================
    -- update total harga
CREATE OR REPLACE FUNCTION update_harga() RETURNS TRIGGER AS $set_total_harga$
    DECLARE
        harga_jual_barang NUMERIC;
    BEGIN
        SELECT harga_jual_goods INTO harga_jual_barang FROM goods WHERE barcode = NEW.barcode;
        NEW.harga_detail_jual := harga_jual_barang;
        NEW.total_harga_detail_jual := NEW.qty * harga_jual_barang;
        RETURN NEW;
    END;
$set_total_harga$ LANGUAGE plpgsql;

CREATE TRIGGER set_total_harga
BEFORE INSERT OR UPDATE ON penjualan_detail
    FOR EACH ROW EXECUTE FUNCTION update_harga();























    ===========================


    CREATE OR REPLACE FUNCTION purchases_updates() RETURNS TRIGGER AS $set_purchases$
    DECLARE
   old_stock INTEGER;
    sum_price NUMERIC;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock =old_stock - NEW.quantity WHERE barcode = NEW.itemcode;

        ELSIF (TG_OP = 'UPDATE') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.barcitemcodeode;
            UPDATE goods SET stock =old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;
            
        ELSIF (TG_OP = 'DELETE') THEN
            --update stok
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock =old_stock + NEW.quantity WHERE barcode = NEW.itemcode;

        END IF;
        -- update penjualan
        SELECT sum(totalprice) INTO sum_price FROM purchaseitems WHERE invoice = NEW.invoice;
        UPDATE purchases SET totalsum = sum_price WHERE invoice = NEW.invoice;

        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$set_purchases$ LANGUAGE plpgsql;

CREATE TRIGGER set_purchases
AFTER INSERT OR UPDATE OR DELETE ON purchaseitems
    FOR EACH ROW EXECUTE FUNCTION purchases_updates();
