
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

=============================================
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