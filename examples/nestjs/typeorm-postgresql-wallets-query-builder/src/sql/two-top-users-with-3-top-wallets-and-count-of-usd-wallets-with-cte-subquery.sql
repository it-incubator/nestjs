WITH owner_sum AS (
	SELECT sum("balance") as usd_sum, "ownerId"
	FROM "wallet" w -- subquery
	WHERE w.currency = 'USD'
	GROUP BY w."ownerId"
),

top_3_wallets AS (
	SELECT u.id as user_id, (
		select jsonb_agg( 
			 json_build_object('w_id', w3.id, 'w_title', w3.title, 'w_balance', w3.balance))
		from (select * 
			  from wallet w2 
			  where w2."ownerId" = u."id" and w2.currency = 'USD'
			  order by w2.balance DESC
			  limit 3
					) w3
		) top_wallets 
	FROM "user" u
)
	

	
SELECT u.*, owner_sum.usd_sum, top_3_wallets.top_wallets
FROM "user" u

	JOIN owner_sum
 	ON u.id = owner_sum."ownerId"

	JOIN top_3_wallets
 	ON u.id = top_3_wallets."user_id"

ORDER BY owner_sum.usd_sum DESC
LIMIT 3;