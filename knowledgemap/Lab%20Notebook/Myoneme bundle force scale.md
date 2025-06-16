From [[Microtubule Energy and Forces in Spirostomum]] and [[Membrane Buckling forces in Spirostomum]] we work out that the force generated from the membrane and microtubules should be roughly of the order $1-10\mu N$ From this we can divide by the number of bundles that we can calculate from
$$N_{bundles} = 4 \frac{A_{unit cell}}{A_{total}}$$
$$N_{bundles} = 4 \frac{A_\text{total}}{A_\text{unit cell}}$$
which works out to a total of $79100$ bundles from the length of the cells and making the usual estimates for total area

### Using Saads assumption
If we assume that each filament contributes equally so that
$$F_{total} = N_\text{bundle} \cdot F_\text{bundle}$$

using 1uN of force total, and the bundles looking like the fishnet parameterization so we get a $\frac{1}{\sqrt{2}}$ assuming they are on 45 degree angles from each other we get that
$$ F \approx 12pN$$

### More careful examination of spring mesh
however some of the filaments are going to be propagating force in a combination of series and parallel like in the image [[mesh spring constant parameterization]]. 

taking some number of bundles in parallel vs series we get
	$$F_{total} = N_\text{parallel} \cdot F_\text{bundle} + \frac{F_\text{bundle}}{N_{series}}$$
We can then estimate the number in parallel vs series from the aspect ratio of the contracted spiro so that
$$ \frac{N_\text{Parallel}}{N_\text{series}} = \frac{\text{length}}{\text{circumfrence}} $$

Which works out to about 1:1 contracted which means this actually doesnt have a huge effect
	$$ F_\text{bundle} = 18pN$$