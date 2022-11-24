
-- INVOICE FORMAT
CREATE OR REPLACE FUNCTION invoice_sales() RETURNS text AS $$
 
    BEGIN
	IF EXISTS(SELECT invoice FROM sales WHERE invoice = 'INV-' || to_char(CURRENT_DATE, 'YYYYMMDD') || - 1) THEN
		return 'INV-' || to_char(CURRENT_DATE, 'YYYYMMDD') || - nextval('invoice_seq');
	ELSE
		ALTER SEQUENCE invoice_seq RESTART WITH 1;
		return 'INV-' || to_char(CURRENT_DATE, 'YYYYMMDD') || - nextval('invoice_seq');
	END IF;
END;

$$ LANGUAGE plpgsql;


-- INSERT QUERY
INSERT INTO saleitems (invoice, itemcode, quantity) VALUES ('INV-20221119-1', 8850389108314, 24);

-- RESET SEQUENCE
ALTER SEQUENCE sequence_name RESTART WITH 1

-- DROP TRIGGER FUNC
DROP TRIGGER [ IF EXISTS ] name ON table_name [ CASCADE | RESTRICT ]


-- TRIGGER FUNCTION
-- STOCK UPDATE 
CREATE OR REPLACE FUNCTION sales_updates() RETURNS TRIGGER AS $set_sales$
 
    DECLARE
    old_stock INTEGER;
    price_sum NUMERIC;
    current_invoice TEXT;
    BEGIN
        IF (TG_OP = 'INSERT') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock - NEW.quantity WHERE barcode = NEW.itemcode;
			current_invoice := NEW.invoice;

        ELSIF (TG_OP = 'UPDATE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = NEW.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity - NEW.quantity WHERE barcode = NEW.itemcode;
			current_invoice := NEW.invoice;

        ELSIF (TG_OP = 'DELETE') THEN
            SELECT stock INTO old_stock FROM goods WHERE barcode = OLD.itemcode;
            UPDATE goods SET stock = old_stock + OLD.quantity WHERE barcode = OLD.itemcode;
			current_invoice := OLD.invoice;
			
        END IF;
		
        SELECT coalesce(sum(totalprice), 0) INTO price_sum FROM saleitems WHERE invoice = current_invoice;
        UPDATE sales SET totalsum = price_sum WHERE invoice = current_invoice;
			
        RETURN NULL;
    END;

$set_sales$ LANGUAGE plpgsql;

CREATE TRIGGER set_sales
AFTER INSERT OR UPDATE OR DELETE ON saleitems
    FOR EACH ROW EXECUTE FUNCTION sales_updates();


-- PRICE UPDATE
CREATE OR REPLACE FUNCTION pricesales_update() RETURNS TRIGGER AS $set_totalprice$
  DECLARE
        sellingprice_goods NUMERIC;
    BEGIN 
        SELECT sellingprice INTO sellingprice_goods FROM goods WHERE barcode = NEW.itemcode;
        NEW.sellingprice := sellingprice_goods;
        NEW.totalprice := NEW.quantity * sellingprice_goods;
        RETURN NEW;
   
    END;

$set_totalprice$ LANGUAGE plpgsql;

CREATE TRIGGER set_totalprice
BEFORE INSERT OR UPDATE ON saleitems
    FOR EACH ROW EXECUTE FUNCTION pricesales_update();