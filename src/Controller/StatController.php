<?php

namespace App\Controller;

use App\Navcoin\Block\Api\BlockApi;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class StatController extends AbstractController
{
    /** @var BlockApi */
    private $blockApi;

    public function __construct(BlockApi $blockApi)
    {
        $this->blockApi = $blockApi;
    }

    /**
     * @Route("/stats")
     * @Template()
     */
    public function index(): array
    {
        return [];
    }

    /**
     * @Route("/stats/supply.json")
     */
    public function supply(Request $request, SerializerInterface $serializer): Response
    {
        $blocks = $this->blockApi->getBlocks(100, 100);
        $bestBlock = $this->blockApi->getBestBlock();

        $resp = new Response($serializer->serialize($blocks, 'json'), 200, [
            'paginator' => $serializer->serialize($blocks->getPaginator(), 'json'),
        ]);

        dump($blocks->getElement(0), $bestBlock);

        return $this->json("");
    }
}
?>
