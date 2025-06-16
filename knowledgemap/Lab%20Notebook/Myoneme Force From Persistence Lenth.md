## Purpose
See if the all the values for forces are consistent with the Worm-like Chain Model and the calculated persistence lengths of the myoneme fibers

## Previous Calculations
Previously I calculated the force for a single myoneme fiber to be ~20pN in [[Myoneme bundle force scale]] (per bundle)
The shortening of myoneme fibers is about .72 for a in the paper, and .81 for b.
The persistence length for uncontracted fibers/low calcium in the TEM is 96.5 $\pm$ 1.0nm
Persistence length for unbound Sfi1 from MDS is 6.21 $\pm$ 1.35nm

## Force From WLC model
From wikipeida [Worm-like chain](https://en.wikipedia.org/wiki/Worm-like_chain)
$$F(x) = \frac{k_B T}{P}\left( \frac{1}{4\left(1 - \frac{x}{L}\right)^2} - \frac{1}{4} + \frac{x}{L} \right)$$

Where P is the persistence length, $k_b$ is the Boltzmann constant, $T$ is the temperature, $L$ is equilibrium length, and $x$ is the displacement from equilibrium.

## Predictions
Estimating the new L after contraction
From the WLC model:
$$<L^2> = 2PL_0\bigg[1-\frac{P}{L_0}\bigg(1-e^{-L_0/P}\bigg)\bigg]$$
this gives us a rest length for a ~100nm filament of 34.13nm. Taking the fractional shortening of .765 (average of two values for IF) we get a displacement of 76.5nm. The fractional change is then $\frac{x}{L} = 2.25$

Taking $T = 300K$, contracted $P = 6.21$nm. From the fractional shortening we see in the IF data. Plugging these values in we get 1.761 pN.