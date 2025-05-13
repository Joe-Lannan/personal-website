## Membrane curvature background
Libre Tests has a nice page on the background for this: https://phys.libretexts.org/Courses/University_of_California_Davis/UCD%3A_Biophysics_241_-_Membrane_Biology/02%3A_Membranes_-_Aggregated_Lipids/2.03%3A_Membrane_Curvature and https://phys.libretexts.org/Courses/University_of_California_Davis/UCD%3A_Biophysics_241_-_Membrane_Biology/07%3A_Computational_Characterization_of_Membranes/7.01%3A_Mathematical_Continuum_Descriptions_of_Membranes

The energy from bending for a membrane (Helfrich theory)  is
$$E_{bend} = \iint dA \frac{1}{2} k (c_1 + c_2 - c_0 + \bar{k}_b c_1 c_2)^2$$
where c1 and c2 are the principal curvatures,  and c0 is the spontaneous curvature. The gaussian term, with $\bar{k}_b$ can apparently be ignored because the total averaged across the sin waves on a cylinder should average the gaussian curvature to zero, though there may be a small imbalance since the tops of the sins are further than the bottoms which have opposite gaussian curvature.

## Estimating Bending Energy Using a sinusoidal cylinder
We need to first calculate the curvature for spiro in its contracted state. We can can do this by approximating spiro as a wavy cylinder with radius $250\mu m$ and a sinusoidal curve that spans the long axis of the cylinder. Because there is only a vertical variation, we can take the rms values of the curvatures here. 
For the azimuthal curvature if we assume the amplitude of the sinusoidal waves is much smaller than the radius axis we get
$$ c_1 = \frac{1}{r} $$ with r being the radius around the cylinder
The other axis is a bit more complex, with a sinusoidal curve
$$r = A \cdot sin(\omega z)$$
For A being the amplitude and $\omega$ being the angular frequency
we get curvature from [wolfram alpha](https://www.wolframalpha.com/input/?i=curvature+of+sin(x)&lk=3)
$$c_2 = \frac{2 \sqrt{2} \cdot A \omega^2 \cdot|sin(\omega x)|}{(A^2 \omega^2 cos^2(2\omega x) + A^2\omega^2 + 2)^\frac{3}{2}}$$
We can now average this over a period
$$\bar{c_2} = \frac{\omega}{2\pi}\int_0^{\frac {2\pi}{\omega}}\frac{2 \sqrt{2} \cdot A \omega^2 \cdot|sin(\omega x)|}{(A^2 \omega^2 cos^2(2\omega x) + A^2\omega^2 + 2)^\frac{3}{2}}$$
$$ \bar{c_2}= \frac{2 \sqrt{2} A \omega^2 }{\pi\sqrt{2 + 2 A^2 \omega^2}}  $$ 
$c_0$ is the spontaneous curvature, dependent on the lipid composition of the membrane. Here we will ignore its contribution since it should not change during contraction. Using the average value of the curvature and assuming that $r >> A$ we can pull the two values for curvature out of the integral to get 
$$E_{bend} =  \frac{1}{2} k (c_1 + c_2 - c_0)^2 \iint dA$$
 $$E_{bend} =  \frac{1}{2} k \Big(\frac{1}{r} + \frac{2 \sqrt{2} A \omega^2 }{\pi\sqrt{2 + 2 A^2 \omega^2}}\Big)^2 * Area$$
 Now plugging in some values:
 $k \approx 20 k_b T$ (https://pubmed.ncbi.nlm.nih.gov/24666592/)
 $r \approx 50\mu m$ uncontracted,  $r \approx 100\mu m$ contracted
 $A \approx 0$ uncontracted, $A \approx 1\mu m$ contracted
 $\omega$ undetermined uncontracted, $\omega \approx \frac{2 \pi}{2 \mu m}$ 
 $Area \approx 1mm \cdot 2 \pi 50 \mu m$
 uncontracted we get
 $$ E_{bend} \approx 300k_b T$$
 Which is about the same as the energy to form a vesicle 
 Contracted we get
 $$ E_{bend} \approx 1.153E7 \cdot k_b T$$
 
## Estimating Tension From Young-Laplace Equation
The Young-Laplace Equation states
$$\Delta p = \gamma \Big( \frac{1}{r_1} + \frac{1}{r_2} \Big)$$
or using curvature
$$\Delta p = \gamma \Big( c_1 + c_2 \Big)$$
where $\Delta p$ is the pressure on a surface, in this case the osmotic pressure, and $\Big( \frac{1}{r_1} + \frac{1}{r_2} \Big)$ is the mean curvature. 
We can get the energy by integrating over the surface tension 
$$ E_{tension} = \iint dA \gamma $$
$$ E_{tension} = \iint dA \frac{\Delta p}{ c_1 + c_2} $$
Again we can use our average values of curvature from the previous calculation to pull them out of the integral to get
$$ E_{tension} = \frac{\Delta p}{\bar{c_1} + \bar{c_2}} \iint dA $$
$\bar{c}_2$ will go to zero because it is periodic. We can then just look at $\bar{c}_1$, which goes from approximately 1/100um to 1/250um. 

taking the pressure for 1uM of sodium chloride where we observe Spiro to dye (5kPa osmotic pressure).

uncontracted with $\bar{c}_1 = \frac{1}{100}$ 
$$E_{tension}= 7.6\cdot10^{13}$$

contracted with $\bar{c}_1 = \frac{1}{250}$ 
$$E_{tension}= 1.9\cdot10^{14}$$
## Force from Membrane Topology
We first need to write the energy in terms of the length (z) of the organism. Taking the total length of the cylinder estimate, we can assume that the total length of membrane along the edge is roughly conserved in this picture so that
$$ \text{Length of a period}  = \frac{\pi  A \cos  \sqrt{4 \pi ^2 A^2 \cos ^2+1}+\coth ^{-1}\left(\frac{2 \pi  A \cos }{\sqrt{4 \pi ^2 A^2 \cos
   ^2+1}-1}\right)}{A w \cos } = \frac{2\pi \beta^2}{\omega}$$
  Taking all of the constant terms into $\beta$ for simplicity. We can then write this in terms of the total length: $z=\frac{2 \pi}{\omega} \cdot \text{Length of a period}$   $$\omega  = \frac{\beta}{\sqrt z}$$
To get an idea of the shape of this function we can just take the derivative with z on $c_2$ since $c_1$ is constant
$$ \frac{d}{dz}\bar{c_2} = \frac{d}{dz} \frac{2 \sqrt{2} A \omega^2 }{\pi\sqrt{2 + 2 A^2 \omega^2}} = \frac{d}{dz} \frac{2 \sqrt{2} A \frac{\beta^2}{z} }{\pi\sqrt{2 + 2 A^2 \frac{\beta^2}{z}}}$$
$$ = - \frac{Ab^2(A^2 \beta^2 +2 z)}{\pi z^2 \sqrt{\frac{A^2 \beta^2}{z}+1} (A^2 \beta^2+z)}$$
or in its full form
 $$F_z = \frac{d}{dz}E_{bend} = \frac{d}{dz}\frac{1}{2} k \Big(\frac{1}{r} + \frac{2 \sqrt{2} A \omega^2 }{\pi\sqrt{2 + 2 A^2 \omega^2}}\Big)^2 * Area = Area*\frac{k}{2} \frac{d}{dz}\Big(\frac{1}{r} + \frac{2 \sqrt{2} A \frac{\beta^2}{z} }{\pi\sqrt{2 + 2 A^2 \frac{\beta^2}{z}}}\Big)^2 $$
 $$ = -  Area*\frac{k}{2} \frac{A \beta^2 (A^2\beta^2 + 2 z)}{\pi z^2 \sqrt{\frac{A^2\beta^2}{z} +1}(A^2 \beta^2 + z)}$$
 The highest order term is then
 $$ F_z \propto \frac{1}{z^3}$$