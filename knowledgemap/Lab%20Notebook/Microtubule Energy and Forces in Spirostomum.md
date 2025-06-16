## Energy Estimate
From [[@cosentinolagomarsinoMicrotubuleOrganizationThreedimensional2007]] the energy of a transverse coil is
$$ E = \frac{kl}{2 r^2} cos^4(\phi)$$
where E is the total elastic energy in the coil, k is the bending stiffness of the microtubule, l is the total length, r is the radius of the coil, and theta is the pitch angle of the coil

quickly plugging in a values for spiro:
	$k \approx 10 pN \cdot um^2$ cited from [[@cosentinolagomarsinoMicrotubuleOrganizationThreedimensional2007]]
	$r \approx 100um$ from looking at IF
	$l \approx 1mm$ from overall organism size
	$\phi \approx 65 \degree$ from the microtubule if in fig 1
	about 200 mt per bundle, 50 counting around the organism (1side x 2)
this gives us 
	$$E \approx 2.83 E 9 k_bT$$
	which seems reasonable given the ATP budget of the cell. This is equivalent to a muscle cell energy output over 25ms.
## Force Estimate
we can now differentiate this equation to estimate the lateral force
	changing variables to the z direction,
	$z = l sin(\theta)$
	$dz = l cos(\phi) d\phi$

Force from energy relation is
	$$F = -\frac{dE}{dz}$$
Changing variables,
	$$F = - \frac{dE}{dz} \cdot \frac{dz}{lcos(\phi) d\phi}$$
plugging in for E
	$$F = - \frac{1}{l cos(\phi)} \cdot \frac{d}{d\phi} \Big[ \frac{kl}{2 r^2} cos^4(\phi)\Big]$$$$F = \frac{k}{r^2} sin(\phi)cos^2(\phi)$$
In the contracted state we have
$\phi \approx 65 \degree$
$r \approx 250\mu m$ from IF
again multiplying by $50 \cdot 10$ for the total number of microtubules
note the maximum force for this equation is at $35.264 \degree$ with a maximum force of $96225 pN$, at rest with an angle around $65 \degree$ we get $40468pN$.